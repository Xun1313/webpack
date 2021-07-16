module.exports = {
  plugins: [
    require('postcss-preset-env')({
      browsers: [
        'last 2 versions',
        '> 1%',
        'not ie <= 8'
      ],
    }),
  ],
}