const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugn = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "src/ts/ACharty.ts"),
  mode: "production",
  output: {
    filename: "ACharty.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "umd",
    library: "ACharty",
  },
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
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      }
    ],
  },
  resolve: { extensions: [".tsx", ".ts", ".js"], },
};