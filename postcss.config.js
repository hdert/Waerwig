const purgecss = require("@fullhuman/postcss-purgecss");

module.exports = {
  plugins: [
    purgecss({
      content: ["dist/*.html", "dist/*.js", "src/zig/wasm.zig"],
      css: ["dist/*.css"],
    }),
  ],
};
