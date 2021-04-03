const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const { EnvironmentPlugin } = require("webpack");

module.exports = {
  mode: "production",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    historyApiFallback: true,
  },
  devtool: "eval-source-map",
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                corejs: 3,
                useBuiltIns: "entry",
              },
            ],
            [
              "@babel/preset-react",
              {
                runtime: "automatic",
              },
            ],
            "@babel/preset-typescript",
          ],
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "resources" }],
    }),
    new EnvironmentPlugin(["SENTRY_DSN"]),
  ],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
};
