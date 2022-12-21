const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugn = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "src/js/index.js"),
  mode: "development",
  output: { filename: "index.js", },
  plugins: [
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, "src/index.html"), }),
    new MiniCssExtractPlugn()
  ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugn.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env"
                  ]
                ],
              },
            },
          },
          "sass-loader"
        ],
      }
    ],
  },
};