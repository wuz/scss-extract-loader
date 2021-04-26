const webpack = require("webpack");
const path = require("path");

const pathToLoader = path.resolve(__dirname, "../index.js");
const pathToTestBundle = path.resolve(__dirname, "./output/test.bundle.js");

module.exports = exports = (filename, options) => {
  return new Promise((resolve, reject) => {
    webpack(
      {
        entry: filename,
        context: __dirname,
        mode: "development",
        module: {
          rules: [
            {
              test: /.scss$/,
              loader: pathToLoader,
              options,
            },
          ],
        },
        output: {
          path: path.join(__dirname, "output"),
          filename: "test.bundle.js",
          libraryTarget: "commonjs2",
        },
      },
      (err, stats) => {
        if (err) reject(err);
        resolve(stats);
      }
    );
  }).then((stats) => {
    if (stats.hasErrors()) {
      stats.compilation.errors[0].stats = stats;
      throw stats.compilation.errors[0];
    }
    if (stats.hasWarnings()) {
      stats.compilation.warnings[0].stats = stats;
      throw stats.compilation.warnings[0];
    }

    delete require.cache[pathToTestBundle];
    const compiled = require(pathToTestBundle);

    return { compiled, stats };
  });
};
