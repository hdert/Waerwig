const std = @import("std");
const Cal = @import("Calculator");
const Addons = @import("Addons");
const allocator = std.heap.wasm_allocator;
const Allocator = std.mem.Allocator;

const Error = error{
    Help,
    Keywords,
};

extern fn inputError([*:0]const u8, usize) void;

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
        _ = equation;
        _ = location;
        _ = self;
        const error_name = @errorName(err);
        inputError(error_name.ptr, error_name.len);
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
