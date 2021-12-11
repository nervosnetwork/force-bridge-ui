module.exports = {
  //mode: "production",
  mode: 'development',
  devtool: 'inline-source-map',

  entry: ['./src/app.tsx' /*main*/],
  output: {
    filename: './bundle.js', // in /dist
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js', '.css', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          isProductionBuild ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]_[local]_[hash:base64]',
              sourceMap: true,
              minimize: true,
            },
          },
        ],
      },
    ],
  },
};
