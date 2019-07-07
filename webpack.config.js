const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const isDebug = process.env.NODE_ENV === "development";
const root_path = __dirname;

module.exports = {
  mode: isDebug ? "development" : "production",
  context: root_path,
  entry: {
    index: path.join(__dirname, "src/index.tsx")
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.js"
  },
  devtool: isDebug ? "source-map" : false, // 'source-map', // 'source-map', //'cheap-eval-source-map',
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json", "scss"],
    modules: ["src", "node_modules"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loaders: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: " last 2 versions, > 5%, safari tp"
                  }
                ],
                "@babel/react"
              ],
              babelrc: false,
              plugins: []
            }
          },
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              compilerOptions: {
                module: "es6"
              }
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(less)$/,
        use: isDebug
          ? [
              "style-loader",
              "css-loader",

              {
                loader: "less-loader",
                options: {
                  javascriptEnabled: true
                }
              }
            ]
          : [
              {
                loader: MiniCssExtractPlugin.loader
              },
              {
                loader: "css-loader",
                options: {
                  sourceMap: true
                }
              },
              {
                loader: "less-loader",
                options: {
                  javascriptEnabled: true
                }
              }

              // "less-loader?javascriptEnabled=true"
            ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [isDebug ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      },

      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          "file-loader?hash=sha512&digest=hex&name=[hash].[ext]",
          {
            loader: "image-webpack-loader",
            options: {
              optipng: {
                optimizationLevel: 7
              },
              gifsicle: {
                interlaced: false
              },
              pngquant: {
                quality: "65-90",
                speed: 4
              },
              mozjpeg: {
                quality: 65,
                progressive: true
              }
            }
          }
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: "file-loader"
      }
    ]
  },

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        extractComments: false,
        cache: true,
        parallel: true,
        sourceMap: !!isDebug,
        terserOptions: {
          ie8: false,
          safari10: false,
          compress: true,
          warnings: !!isDebug
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    runtimeChunk: {
      name: "manifest"
    },
    splitChunks: {
      chunks: "async",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: false,
      cacheGroups: {
        vendor: {
          name: "vendor",
          chunks: "all",
          priority: 0,
          minChunks: 2,
          reuseExistingChunk: false,
          test: /[\\/]node_modules[\\/]/,
          enforce: true
        },
        commons: {
          chunks: "async",
          name: "commons",
          /**
           * minSize 默认为 30000
           * 想要使代码拆分真的按照我们的设置来
           * 需要减小 minSize
           */
          minSize: 0,
          // 至少为两个 chunks 的公用代码
          minChunks: 2
        },
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all",
          enforce: true
        }
      }
    }
  },
  performance: {
    hints: false
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: isDebug ? JSON.stringify("development") : JSON.stringify("production")
      }
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    // new CleanWebpackPlugin(
    //   ["dist/*.js", "dist/*.css"], // 匹配删除的文件
    //   {
    //     root: __dirname, // 根目录
    //     verbose: true, // 开启在控制台输出信息
    //     dry: false // 启用删除文件
    //   }
    // ),
    new MiniCssExtractPlugin({
      filename: isDebug ? "[name].css" : "[name].[chunkhash:8].css",
      chunkFilename: isDebug ? "[id].css" : "[id].[chunkhash:8].css"
    }),

    new HtmlWebpackPlugin({
      filename: path.join(__dirname, "index.html"),
      template: path.join(__dirname, "src/template/normal.tpl"),
      inject: "body",
      hash: true,
      cache: true,
      minify: !isDebug,

      chunks: ["vendor", "index", "manifest", "commons"]
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/)
  ]

  // externals: {
  //     "react": "React",
  //     "react-dom": "ReactDOM"
  // }
};
