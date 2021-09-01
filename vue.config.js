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
      title: 'Home Page',
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ['chunk-vendors', 'chunk-common', 'home']
    },
    result: {
      entry: 'src/pages/result/main.js',
      template: '/src/pages/result/result.html',
      filename: 'result.html',
      title: 'Result Page',
      chunks: ['chunk-vendors', 'chunk-common', 'result']
    },
    terms: {
      entry: 'src/pages/terms/main.js',
      template: '/src/pages/terms/terms.html',
      filename: 'terms.html',
      title: 'Data Use Terms',
      chunks: ['chunk-vendors', 'chunk-common', 'terms']
    },
    about: {
      entry: 'src/pages/about/main.js',
      template: '/src/pages/about/terms.html',
      filename: 'about.html',
      title: 'About Bravo',
      chunks: ['chunk-vendors', 'chunk-common', 'about']
    },
  },
  outputDir: 'dist',
}
