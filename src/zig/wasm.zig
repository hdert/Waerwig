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

extern fn sanitizeForHtml([*]const u8, usize) [*:0]const u8;

extern fn handleAnswer([*]const u8, usize, f64, bool) void;

pub const ErrorHandler = struct {
    const Self = @This();

    allocator: Allocator,

    pub fn handleError(
        self: Self,
        err: anyerror,
        location: ?[3]usize,
        equation: ?[]const u8,
    ) !void {
        if (err == Allocator.Error.OutOfMemory) {
            const message = @errorName(err);
            inputError(message.ptr, message.len); // Safe
        }
        const E = Cal.Error;
        const error_message = Cal.errorDescription(err) catch @errorName(err); // Safe

        var message: []const u8 = undefined;
        if (location) |l| {
            switch (err) {
                E.DivisionByZero, E.EmptyInput => {
                    message = std.fmt.allocPrint( // Safe
                        self.allocator,
                        "<p class='mb-0'>{s}</p>",
                        .{error_message}, // Safe
                    ) catch |e| {
                        const error_name = @errorName(e); // Safe
                        inputError(error_name.ptr, error_name.len); // Safe
                        return;
                    };
                },
                else => {
                    std.debug.assert(l[1] >= l[0]);
                    const eq = equation orelse return; // Unsafe
                    const pre_error = eq[0..l[0]]; // Safe
                    const in_error_slice = eq[l[0]..l[1]];
                    const in_error = std.mem.span(sanitizeForHtml(in_error_slice.ptr, in_error_slice.len)); // Safe
                    defer self.allocator.free(in_error);
                    const post_error_slice = eq[l[1]..l[2]];
                    const post_error = std.mem.span(sanitizeForHtml(post_error_slice.ptr, post_error_slice.len)); // Safe
                    defer self.allocator.free(post_error);

                    message = std.fmt.allocPrint( // Safe
                        self.allocator,
                        \\<p class='fw-light mb-0'>
                        \\  {s}
                        \\  <span class='fw-bold'>{s}</span>
                        \\  {s}
                        \\</p>
                        \\<p class='mb-0'>{s}</p>
                    ,
                        .{
                            pre_error, // Safe
                            in_error, // Safe
                            post_error, // Safe
                            error_message, // Safe
                        },
                    ) catch |e| {
                        const error_name = @errorName(e); // Safe
                        inputError(error_name.ptr, error_name.len); // Safe
                        return;
                    };
                },
            }
        } else {
            message = std.fmt.allocPrint( // Safe
                self.allocator,
                "<p class='mb-0'>{s}</p>",
                .{error_message}, // Safe
            ) catch |e| {
                const error_name = @errorName(e); // Safe
                inputError(error_name.ptr, error_name.len); // Safe
                return;
            };
        }
        defer self.allocator.free(message);
        inputError(message.ptr, message.len); // Safe
    }

    pub fn init() Self {
        return Self{
            .allocator = allocator,
        };
    }
};

extern fn print([*]const u8, usize) void;

export fn alloc(length: usize) ?[*]u8 {
    return if (allocator.alloc(u8, length)) |slice|
        slice.ptr
    else |_|
        null;
}

fn registerKeywords(equation: *Cal) !void {
    try equation.addKeywords(&.{
        "Infinity",
        "NaN",
    }, &.{
        .{ .Constant = std.math.inf(f64) },
        .{ .Constant = std.math.nan(f64) },
    });
}

export fn evaluateUnchecked(input: [*:0]const u8, previousInput: f64) f64 {
    const nan = std.math.nan(f64);
    const slice = std.mem.span(input);
    defer allocator.free(slice);

    var equation = Cal.init(
        allocator,
        &.{ Addons.registerKeywords, registerKeywords },
    ) catch return nan;
    defer equation.free();

    equation.registerPreviousAnswer(previousInput) catch return nan;
    const infix_equation = equation.newInfixEquation(slice, null) catch return nan;

    return infix_equation.evaluate() catch nan;
}

export fn evaluate(input: [*:0]const u8, previousInput: f64, addToHistory: bool) void {
    const slice = std.mem.span(input);
    defer allocator.free(slice);
    const error_handler = ErrorHandler.init();

    var equation = Cal.init(
        allocator,
        &.{ Addons.registerKeywords, registerKeywords },
    ) catch |err| {
        try error_handler.handleError(err, null, null);
        return;
    };
    defer equation.free();

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
    handleAnswer(
        infix_equation.data.ptr,
        infix_equation.data.len,
        result,
        addToHistory,
    );
}
