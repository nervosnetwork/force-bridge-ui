// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const CracoLessPlugin = require('craco-less');

module.exports = {
  babel: {
    plugins: ['babel-plugin-styled-components'],
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://force-bridge-dev.ckbapp.dev',
        cookieDomainRewrite: true,
        headers: { host: 'force-bridge-dev.ckbapp.dev' },
        // pathRewrite: { '^/api': '' },
      },
      // '/api': {
      //   target: 'http://mainnet-watcher.force-bridge.com',
      //   cookieDomainRewrite: true,
      //   headers: { host: 'mainnet-watcher.force-bridge.com' },
      //   pathRewrite: { '^/api': '' },
      // },
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#00CCC0',
              '@border-radius-base': '8px',
              '@btn-border-radius-base': '8px',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
