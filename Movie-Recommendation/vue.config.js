const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: '',

  chainWebpack: config => {
    // 生产环境启用 bundle 分析
    if (process.env.NODE_ENV === 'production') {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
    }

    // 配置路径别名
    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("views", resolve("src/views"));
  },

  // 关键：使用 Vue CLI 提供的 css.loaderOptions 来配置 stylus-loader
  // 这种方式不会破坏现有配置，是官方推荐的做法
  css: {
    loaderOptions: {
      stylus: {
        // 在这里可以添加 stylus-loader 支持的选项
        // 例如，如果你需要全局注入一个 stylus 文件，可以这样写：
        // import: [path.resolve(__dirname, 'src/assets/css/variables.styl')]
        
        // 注意：这里不要写 preferPathResolver
      }
    }
  }
}