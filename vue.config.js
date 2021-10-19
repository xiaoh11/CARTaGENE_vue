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
    variant: {
      entry: 'src/pages/variant/main.js',
      template: 'src/pages/variant/variant.html',
      filename: 'variant',
      title: 'Bravo:Variant',
      chunks: ['chunk-vendors', 'chunk-common', 'variant']
    },
    region: {
      entry: 'src/pages/region/main.js',
      template: 'src/pages/region/region.html',
      filename: 'region',
      title: 'Bravo:Region',
      chunks: ['chunk-vendors', 'chunk-common', 'region']
    },
    gene: {
      entry: 'src/pages/gene/main.js',
      template: 'src/pages/gene/gene.html',
      filename: 'gene',
      title: 'Bravo:Gene',
      chunks: ['chunk-vendors', 'chunk-common', 'gene']
    },
    terms: {
      entry: 'src/pages/terms/main.js',
      template: 'src/pages/terms/terms.html',
      filename: 'Bravo:Terms',
      title: 'Data Use Terms',
      chunks: ['chunk-vendors', 'chunk-common', 'terms']
    },
    about: {
      entry: 'src/pages/about/main.js',
      template: 'src/pages/about/terms.html',
      filename: 'about',
      title: 'Bravo:About',
      chunks: ['chunk-vendors', 'chunk-common', 'about']
    },
    404: {
      entry: 'src/pages/about/main.js',
      template: 'src/pages/about/terms.html',
      filename: '404',
      title: 'Bravo:404',
      chunks: ['chunk-vendors', 'chunk-common', '404']
    },
  },
  outputDir: 'dist',
  devServer: {
    historyApiFallback: false
  }
}
