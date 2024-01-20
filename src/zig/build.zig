const std = @import("std");

pub fn build(b: *std.Build) void {
    const calculator = b.dependency("calculator", .{});

    // WASM library

    const exe = b.addExecutable(.{
        .name = "Calculator",
        .root_source_file = .{ .path = "wasm.zig" },
        .target = b.resolveTargetQuery(.{ .cpu_arch = .wasm32, .os_tag = .freestanding }),
        .optimize = .ReleaseFast,
    });
    exe.root_module.addImport("Calculator", calculator.module("Calculator"));
    exe.root_module.addImport("Addons", calculator.module("Addons"));

    exe.entry = .disabled;
    exe.rdynamic = true;

    const output = b.addInstallArtifact(exe, .{
        .dest_dir = .{
            .override = .{
                .custom = "../../wasm/",
            },
        },
    });
    b.getInstallStep().dependOn(&output.step);
}
