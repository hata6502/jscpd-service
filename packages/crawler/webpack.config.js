module.exports = {
  mode: "production",
  entry: {
    enqueue: "./src/enqueue.ts",
    generateSitemap: "./src/generateSitemap.ts",
    report: "./src/report.ts",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
  output: {
    libraryTarget: "umd",
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  target: "node",
};
