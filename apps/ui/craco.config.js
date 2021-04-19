const CracoLessPlugin = require('craco-less');

module.exports = {
  babel: {
    plugins: ['babel-plugin-styled-components'],
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#00CCC0', '@btn-border-radius-base': '8px' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
