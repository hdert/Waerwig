const std = @import("std");
const Cal = @import("Calculator");
const Addons = @import("Addons");
const allocator = std.heap.wasm_allocator;

const Error = error{
    Help,
    Keywords,
};

extern fn inputError([*:0]const u8, usize) void;

pub const ErrorHandler = struct {
    const Self = @This();

    pub fn handleError(
        self: Self,
        err: anyerror,
        location: ?[3]usize,
        equation: ?[]const u8,
    ) !void {
        _ = equation;
        _ = location;
        _ = self;
        const error_name = @errorName(err);
        inputError(error_name.ptr, error_name.len);
    }

    pub fn init() Self {
        return Self{};
    }
};

extern fn print([*:0]const u8, usize) void;

export fn alloc(length: usize) ?[*]u8 {
    return if (allocator.alloc(u8, length)) |slice|
        slice.ptr
    else |_|
        null;
}

export fn evaluate(input: [*:0]const u8, previousInput: f64) f64 {
    const slice = std.mem.span(input);
    defer allocator.free(slice);
    const error_handler = ErrorHandler.init();

    var equation = Cal.Equation.init(
        allocator,
        null,
        null,
    ) catch |err| {
        try error_handler.handleError(err, null, null);
        return 0;
    };
    defer equation.free();
    Addons.registerKeywords(&equation) catch |err| {
        try error_handler.handleError(err, null, null);
        return 0;
    };

    equation.registerPreviousAnswer(previousInput) catch return 0;
    const infix_equation = equation.newInfixEquation(
        slice,
        error_handler,
    ) catch return 0;
    return infix_equation.evaluate() catch |err| {
        try error_handler.handleError(err, null, null);
        return 0;
    };
}
