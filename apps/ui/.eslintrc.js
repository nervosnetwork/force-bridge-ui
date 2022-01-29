module.exports = {
  extends: [require.resolve('../../.eslintrc.js'), 'react-app'],
  settings: {
    'import/resolver': { node: { paths: ['src'] } },
  },
  ignorePatterns: ['**/generated', '**/*.js'],
};
