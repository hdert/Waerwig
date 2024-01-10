const purgecss = require("@fullhuman/postcss-purgecss");

module.exports = {
  plugins: [
    purgecss({
      content: [
        "src/pug/*.pug",
        "src/includes/*.pug",
        "src/js/*.js",
        "src/zig/wasm.zig",
        "node_modules/bootstrap/js/dist/tooltip.js",
      ],
      css: ["src/scss/*.scss", "src/scss/_modules/*.scss"],
    }),
  ],
};
