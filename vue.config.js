//Include package version in 
process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  publicPath: '/',
  pages: {
    home: {
      // entry js for the page
      entry: 'src/pages/home/main.js',
      // the source template
      template: 'src/pages/home/home.html',
      // output as dist/index.html
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'CARTaGENE:Home',
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ['chunk-vendors', 'chunk-common', 'home']
    },
    variant: {
      entry: 'src/pages/variant/main.js',
      template: 'src/pages/variant/variant.html',
      title: 'CARTaGENE:Variant',
      chunks: ['chunk-vendors', 'chunk-common', 'variant']
    },
    region: {
      entry: 'src/pages/region/main.js',
      template: 'src/pages/region/region.html',
      title: 'CARTaGENE:Region',
      chunks: ['chunk-vendors', 'chunk-common', 'region']
    },
    gene: {
      entry: 'src/pages/gene/main.js',
      template: 'src/pages/gene/gene.html',
      title: 'CARTaGENE:Gene',
      chunks: ['chunk-vendors', 'chunk-common', 'gene']
    },
    terms: {
      entry: 'src/pages/terms/main.js',
      template: 'src/pages/terms/terms.html',
      title: 'CARTaGENE:Terms',
      chunks: ['chunk-vendors', 'chunk-common', 'terms']
    },
    about: {
      entry: 'src/pages/about/main.js',
      template: 'src/pages/about/about.html',
      title: 'CARTaGENE:About',
      chunks: ['chunk-vendors', 'chunk-common', 'about']
    },
    login: {
      entry: 'src/pages/login/main.js',
      template: 'src/pages/login/login.html',
      title: 'Bravo:Login',
      chunks: ['chunk-vendors', 'chunk-common', 'login']
    },
    logout: {
      entry: 'src/pages/logout/main.js',
      template: 'src/pages/logout/logout.html',
      title: 'CARTaGENE:Logout',
      chunks: ['chunk-vendors', 'chunk-common', 'logout']
    },
    404: {
      entry: 'src/pages/404/main.js',
      template: 'src/pages/404/404.html',
      filename: '404.html',
      title: 'CARTaGENE:404',
      chunks: ['chunk-vendors', 'chunk-common', '404']
    },
  },

  outputDir: 'dist',

  devServer: {
    historyApiFallback: false
  },

  lintOnSave: false
}
