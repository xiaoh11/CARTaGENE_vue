// let glob = require('glob')
// 
// //To configure pages Get the html and js
// function getEntry(globPath) {
//   let entries = {}, tmp, htmls = {};
// 
//   // read src/pages/**/All the html files below
//   glob.sync(globPath+'html').forEach(function(entry) {
//     tmp = entry.split('/').splice(-3);
//     htmls[tmp[1]] = entry
//   })
// 
//   // Read src/pages/**/Everything down there js file
//   glob.sync(globPath+'js').forEach(function(entry) {
//     tmp = entry.split('/').splice(-3);
//     entries[tmp[1]] = {
//       entry,
//       template: htmls[tmp[1]] ? htmls[tmp[1]] : 'index.html', //  The current directory does not have any html Common public/index.html As template
//       filename:tmp[1] + '.html'   //  By folder name.html As access address
//     };
//   });
//   console.log(entries)
//   return entries;
// }
// 
// let htmls = getEntry('./src/pages/**/*.');
// 
module.exports = {
  publicPath: '/',
  pages: {
    home: {
      // entry for the page
      entry: 'src/pages/home/main.js',
      // the source template
      //template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Home Page',
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    result: {
      // entry for the page
      entry: 'src/pages/result/main.js',
      //template: 'public/index.html',
      filename: 'result.html',
      title: 'Result Page',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
  },
  //  Solve the problem of static file path 404 after packaging
  //publicPath: './',
  outputDir: 'dist',
}
