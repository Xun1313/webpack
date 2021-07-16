const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//取代 style loader 不須下載
//const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader');
//console.log(VueLoaderPlugin);

// webpack 預設只看得懂 js

// webpack 5 的新功能 已經內含 Asset Modules(file-loader、url-loader、raw-loader)，不須另外裝

// asset/resource - 對應 Webpack 4 的 file-loader
// 例如: 專案內部資源(讓圖片，字體可辨識)，吃自己的資源
// 打包後用引入檔案的方式，編譯出檔案也引入

// asset/inline - 對應 Webpack 4 的 url-loader
// 例如: 圖片轉為 base64
// 打包後直接注入在檔案裡，不編譯出檔案也不引入

// asset/source - 對應 Webpack 4 的 raw-loader
// 例如: json import 進來轉為字串
// 打包後直接注入在檔案裡，不編譯出檔案也不引入

// asset - 對應 Webpack 4 的 url-loader
// 例如: 圖片小於預設大小轉為 base64，大於用引入檔案的方式
// 可選擇走 asset/resource 或 asset/inline

module.exports = {
  // 從 package.json 抓到 NODE_ENV 的自定義值
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  // 進入點 prefix 路徑
  context: path.resolve(__dirname, './src'),
  // 進入點路徑
  // 複數 js 檔
  // css 引入 js 是因為進入點是 js 的關係
  // entry 的 key 代表 HtmlWebpackPlugin chunk 的 js
  entry: {
    main: './js/main.js',
    /* index: './js/index.js',
    about: './js/about.js' */
  },
  output: {
    // 產出路徑
    path: path.resolve(__dirname, 'dist'),
    // 產出檔案名稱
    // [name] 各個等於 entry 的 key
    // [hash] 為了不讓瀏覽器吃住快取，特別讓檔名在每次編譯都不一樣
    filename: './js/[name].[hash].bundle.js',
    // 所有靜態資源的路徑前綴
    //publicPath: '/test',
    // 編譯後如果是不一樣的檔案用覆蓋的方式，預設是 false 不一樣的再多一支檔案
    clean: true,
    // Asset Modules 的統一產出路徑，module 裡的 Rule.generator.filename 裡的權重比較大
    assetModuleFilename: './assets/[name].[hash][ext]',
  },
  devServer: {
    // 資瞭夾根目錄
    contentBase: path.join(__dirname, 'dist'),
    // 是否為 hot reload
    hot: true,
    // 壓縮
    compress: false,
    // port 號
    port: 8000,
    // 自動開啟視窗
    open: false,
  },
  resolve: {
    // 用在 import 時不用相對路徑
    // 自動查找以下路徑
    /* modules: [
      path.resolve('src'),
      path.resolve('src/js'),
      path.resolve('src/css'),
      path.resolve('src/images'),
      path.resolve('node_modules'),
    ], */
    // 自動查找副檔名符合的檔案
    //extensions: ['.vue', '.mjs', '.js', '.json'],
    alias: {
      // 自定義檔案前綴
      '@': path.resolve(__dirname, './src'),
      'vue$': 'vue/dist/vue.esm.js'// 相比於 vue.esm.js 小 30% 左右
    },
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          // 每次打包會判斷是否和原本的一樣，決定是否再次打包
          // 預設每一支 js 檔都會把 node_modules 包在一起
          // 把 node_modules 打包成 vendor.js
          // 減少每次都要重新打包 node_modules
          // 盡量只重打包 entry 的 js
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          // async：只處理 Lazy Loading 的 chunks，例如 import(xxx) 語法載入的模組
          // initial：只處理同步加載的 chunk，例如 import xxx 語法載入的模組
          // all：兼容以上兩種方式，通通進行處理
          chunks: 'initial',
          enforce: true// 不參考全域的屬性
        },
      },
    },
  },
  module: {
    // 解析不同檔案的 loader
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        // 正則驗證到檔名是 css 就要用以下的 loader 解析
        test: /\.(sa|sc|c)ss$/,
        // 順序由後往前解析
        // MiniCssExtractPlugin.loader 取代 style-loader
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: '@import "src/scss/all.scss";',
            }
          }
        ],
      },
      {
        // 正則驗證到檔名是 js 就要用以下的 loader 解析
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      },
      {
        test: /\.(ttf|woff|woff2)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/font/[name].[hash][ext]'
        },
      },
      {
        test: /\.(jpg|png|gif)$/i,
        type: 'asset',
        generator: {
          filename: 'assets/img/[name].[hash][ext]'
        },
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 // 1kb
          },
        },
        use: [
          /* {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: '[path][name].[ext]?[hash:8]',
              fallback: require.resolve('file-loader'),
            },
          }, */
          {
            // 圖片壓縮，沒有出現在文檔，有另一個 image-minimizer-webpack-plugin
            // 先執行壓縮
            loader: 'image-webpack-loader',
            options: {
              //disable: process.env.NODE_ENV === 'production' ? false : true,
              mozjpeg: {
                // jpg
                progressive: true,
                quality: 65,
              },
              optipng: {
                // png
                enabled: false, // 表示不啟用這一個圖片優化器
              },
              pngquant: {
                // png
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                // gig
                interlaced: false,
              },
              webp: {
                // webp
                quality: 75, // 配置選項表示啟用 WebP 優化器
              },
            },
          },
        ],
      },
    ],
  },
  // 顯示未編譯的 debug 模式
  //devtool: 'source-map',
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      // HtmlWebpackPlugin 可用編譯的方式產出 html，chunk 能引入對應的 js 路徑，不需要自己引入，預設不產出
      // 無框架每一個分頁都要寫
      // 以哪一個 html 的路徑內容產出，預設無內容
      template: 'public/index.html',
      // 編譯後檔名
      filename: 'index.html',
      title: 'index',
      viewport: 'width=device-width, initial-scale=1.0',
      // 依照 entry 的 key 選擇引入哪個 js
      chunks: ['main', 'vendor'],
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
      // 資源要放哪裡 true || 'head' || 'body' || false
      //inject: 'body',
      // 資源的前綴，例如: domain 或其他路徑
      //base: 'https://example.com/path'
    }),
    /* new HtmlWebpackPlugin({
      template: 'html/about.html',
      filename: 'about.html',
      title: 'about',
      viewport: 'width=device-width, initial-scale=2.0',
      chunks: ['about', 'vendor']
    }), */
    // 先在 js 中把 css import 進來
    // MiniCssExtractPlugin 可在編譯後也產出 css 檔案並以 link 方式自動引入，預設 style-loader 是不產檔案從 js 檔裡面至抓出 css 檔以 style tag 方式插入 head，
    new MiniCssExtractPlugin({
      // [hash] 為了不讓瀏覽器吃住快取，特別讓檔名在每次編譯都不一樣
      filename: './css/[name].[hash].css'
    }),
    // 編譯後如果是不一樣的檔案用覆蓋的方式，預設是不一樣的再多一支檔案，和 output.clean 類似功能
    //new CleanWebpackPlugin(),
    new CopyPlugin({
      // 純複製靜態檔案，不編譯
      patterns: [
        { from: "public", to: "public" },
      ],
    }),
    /* new webpack.ProvidePlugin({
      // 把 node_modules 的套件引入在全域
      // 不推薦，因為失去組件化的意義，也不好 debug
      axios: 'axios'
    }) */
  ],
}