const std = @import("std");
const Cal = @import("Calculator");
const Addons = @import("Addons");
const allocator = std.heap.wasm_allocator;
const Allocator = std.mem.Allocator;

const Error = error{
    Help,
    Keywords,
};

extern fn inputError([*]const u8, usize) void;

extern fn handleAnswer([*]const u8, usize, f64) void;

pub const ErrorHandler = struct {
    const Self = @This();

    allocator: Allocator,

    pub fn handleError(
        self: Self,
        err: anyerror,
        location: ?[3]usize,
        equation: ?[]const u8,
    ) !void {
        const E = Cal.Error;
        const error_message = switch (err) {
            E.InvalidOperator,
            E.Comma,
            => "You have entered an invalid operator\n",
            E.InvalidKeyword => "You have entered an invalid keyword\n",
            E.DivisionByZero => "Cannot divide by zero\n",
            E.EmptyInput => return, // Silent error
            E.SequentialOperators => "You cannot enter sequential operators\n",
            E.EndsWithOperator => "You cannot finish with an operator\n",
            E.StartsWithOperator => "You cannot start with an operator\n",
            E.ParenEmptyInput => "You cannot have an empty parenthesis block\n",
            E.ParenStartsWithOperator => "You cannot start a parentheses block with an operator\n",
            E.ParenEndsWithOperator => "You cannot end a parentheses block with an operator\n",
            E.ParenMismatched,
            E.ParenMismatchedClose,
            E.ParenMismatchedStart,
            => "Mismatched parentheses!\n",
            E.InvalidFloat => "You have entered an invalid number\n",
            E.FnUnexpectedArgSize => "You haven't passed the correct number of arguments to this function\n",
            E.FnArgBoundsViolated => "Your arguments aren't within the range that this function expected\n",
            E.FnArgInvalid => "Your argument to this function is invalid\n",
            else => @errorName(err),
        };
        var message: []const u8 = undefined;
        if (location) |l| {
            switch (err) {
                E.DivisionByZero, E.EmptyInput => {
                    message = std.fmt.allocPrint(
                        self.allocator,
                        "<p class='mb-0'>{s}</p>",
                        .{error_message},
                    ) catch |e| {
                        const error_name = @errorName(e);
                        inputError(error_name.ptr, error_name.len);
                        return;
                    };
                },
                else => {
                    std.debug.assert(l[1] >= l[0]);
                    const eq = equation orelse return;

                    message = std.fmt.allocPrint(
                        self.allocator,
                        \\<p class='fw-light mb-0'>
                        \\  {s}
                        \\  <span class='fw-bold'>{s}</span>
                        \\  {s}
                        \\</p>
                        \\<p class='mb-0'>{s}</p>
                    ,
                        .{
                            eq[0..l[0]],
                            eq[l[0]..l[1]],
                            eq[l[1]..l[2]],
                            error_message,
                        },
                    ) catch |e| {
                        const error_name = @errorName(e);
                        inputError(error_name.ptr, error_name.len);
                        return;
                    };
                },
            }
        } else {
            message = std.fmt.allocPrint(
                self.allocator,
                "<p class='mb-0'>{s}</p>",
                .{error_message},
            ) catch |e| {
                const error_name = @errorName(e);
                inputError(error_name.ptr, error_name.len);
                return;
            };
        }
        defer self.allocator.free(message);
        inputError(message.ptr, message.len);
    }

    pub fn init() Self {
        return Self{
            .allocator = allocator,
        };
    }
};

extern fn print([*:0]const u8, usize) void;

export fn alloc(length: usize) ?[*]u8 {
    return if (allocator.alloc(u8, length)) |slice|
        slice.ptr
    else |_|
        null;
}

export fn evaluate(input: [*:0]const u8, previousInput: f64) void {
    const slice = std.mem.span(input);
    defer allocator.free(slice);
    const error_handler = ErrorHandler.init();

    var equation = Cal.Equation.init(
        allocator,
        null,
        null,
    ) catch |err| {
        try error_handler.handleError(err, null, null);
        return;
    };
    defer equation.free();
    Addons.registerKeywords(&equation) catch |err| {
        try error_handler.handleError(err, null, null);
        return;
    };

    equation.registerPreviousAnswer(previousInput) catch |err| {
        try error_handler.handleError(err, null, null);
        return;
    };
    const infix_equation = equation.newInfixEquation(
        slice,
        error_handler,
    ) catch return;

    const result = infix_equation.evaluate() catch |err| {
        try error_handler.handleError(err, null, null);
        return;
    };
    handleAnswer(infix_equation.data.ptr, infix_equation.data.len, result);
}
