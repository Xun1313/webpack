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



// code-splitting
// 目的:
// (1)移除重複的 modules:使用 SplitChunks 將npm module
// (例如:react、vue等)或者自定義的組件獨立打包出來。
// (2)Dynamic Imports:透過import()來達到code split。
// (3)拆分成小的 bundle，真的需要用到的 bundle 的頁面才引入，不斷堆疊
// 注意事項:
// (1)依頁面分成本身頁面的 js(dynamic import) 和組件的 js 和 npm 和 css(style import)
// (2)換頁時自動加載


// Module
// // npm或是自定義的組件,js

// Chunk
// // 辨認 module 該如何 code-splitting 的過程
// // 例如:一樣的模組就會只打包一次
// // 直接對應所輸出的 bundle，可以是一對多

// Bundle
// 把 module 打包或是編譯成最後給瀏覽器閱讀的檔案
// 運作方式:
// (1)分析所有檔案以及套件的相依性把自己的 JS 檔案跟 npm 或 自定義的 js 或組件打包在同一支
// (2)開發用 import 跟 export，輸出時被 babel 或者是 webpack 轉成 CommonJS 或是其他形式了
// (3)外面還有再包一層來負責解析 require 這一些語法
// (4)檔案愈來愈大的時候，花的時間也就自然愈來愈多，因為 webpack 要搞清楚到底要怎麼打包


// 動態(lazy-loading)的定義
// //一定會額外打包成 bundle 不管 cacheGroup 的設定
// 使用方式: import()的 lazy loading 本來就可以強制提取出 bundle，需要時再引入
// //有 weback 專用屬性
// webpackChunkName
// //如果把註解移除，預設的 chunkName 為數字
// webpackPreload
// //確實 link 有加上 preload
// //下次 import 不再次下載也能拿到data
// webpackPrefetch

// 靜態的定義
// //不一定會分 bundle 不管 cacheGroup 的設定
// 使用方式: import '' from ''的 static 會包在頁面 bundle
// //沒有weback專用屬性


// *npm
// 動態
// 有名字有分開
// 靜態
// 沒名字有分開
// (1)被提出來的 npm 包為甚麼不是在vendor.js
// //因為不一定當下頁面就要引入該套件
// //vendor.js一定是全部頁面有要用到的
// (2)被提出來的npm包為甚麼檔名是亂數
// //因為optimization裡的chunks是initial包裝到靜態的js項目沒有webpackChunkName的屬性

// *自定義的頁面,js,css,框架組件
// 動態
// 有名字有分開
// 靜態
// 沒名字沒分開
// #決定哪種模式看這支 js 在這頁是否一定會用到

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
    //about: './js/about.js'
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
    // 建立在內網，直接用手機連線
    //host: '192.168.98.59'
    /* proxy: {
      '/api': {
        target: 'http://api-tca.b2bdev.com',
        secure: false,
        changeOrigin: true
      }
    } */
  },
  resolve: {
    // 用在 import 時不用相對路徑

    // 自動查找以下路徑中符合的檔案
    /* modules: [
      path.resolve('src'),
      path.resolve('src/js'),
      path.resolve('src/css'),
      path.resolve('src/images'),
      path.resolve('node_modules'),
    ], */
    // 自動查找路徑中副檔名符合的檔案
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
        // 抽離 node_modules
        vendor: {
          // 預設每一支 bundle 都會把 node_modules 打包在一起
          // 目的:
          // 不要把每一支 bundle 和 node_modules 打包在一起，這樣每一頁的 js 檔會重複打包套件的 js，太肥
          // 做法:
          // 把 node_modules 打包成 vendor.js，
          // 結果:
          // 例如: vue 的核心代碼包成一支 vendor.js
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          // async：(預設)只處理 Lazy Loading(動態) 的 chunks，例如 import(xxx) 語法載入的模組
          // initial：只處理同步(靜態)加載的 chunk，例如 import 'xxx' or import x from 'xxx' 語法載入的模組
          // all：兼容以上兩種方式，通通進行處理
          chunks: 'initial',
          priority: 20,
          // 優先依照哪個規則走
          enforce: true// 不參考全域的屬性
        },
        // 抽離公用模組
        common: {
          // 把共用的 js 檔抽離成一支，而不是每個地方都寫一次
          chunks: 'initial',
          minSize: 0,
          name: 'common',
          minChunks: 2,
          // 被引用的次數符合就另外包成 bundle,不符合則和頁面 bundle 包一起，默認為1
          priority: 10,
          // 優先依照哪個規則走
        },
      },
    },
    // 管理所有模塊之間如何引用
    runtimeChunk: { name: 'manifest' },
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
        // use: [
        //   /* {
        //     loader: 'url-loader',
        //     options: {
        //       limit: 8192,
        //       name: '[path][name].[ext]?[hash:8]',
        //       fallback: require.resolve('file-loader'),
        //     },
        //   }, */
        //   {
        //     // 圖片壓縮，沒有出現在文檔，有另一個 image-minimizer-webpack-plugin
        //     // 先執行壓縮
        //     loader: 'image-webpack-loader',
        //     options: {
        //       //disable: process.env.NODE_ENV === 'production' ? false : true,
        //       mozjpeg: {
        //         // jpg
        //         progressive: true,
        //         quality: 65,
        //       },
        //       optipng: {
        //         // png
        //         enabled: false, // 表示不啟用這一個圖片優化器
        //       },
        //       pngquant: {
        //         // png
        //         quality: [0.65, 0.9],
        //         speed: 4,
        //       },
        //       gifsicle: {
        //         // gig
        //         interlaced: false,
        //       },
        //       webp: {
        //         // webp
        //         quality: 75, // 配置選項表示啟用 WebP 優化器
        //       },
        //     },
        //   },
        // ],
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