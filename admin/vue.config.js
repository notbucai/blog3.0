module.exports = {
  lintOnSave: false,
  publicPath: "./",
  pages: {
    // title:"后台管理平台"
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: '后台管理平台',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
  },
  devServer: {
    port: 9906,
    proxy: {
      "/api": {
        // target: "https://api.notbucai.cc",
        target: "http://127.0.0.1:9905",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": "/"
        }
      },
    }
  }

}
