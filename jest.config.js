module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['packages', 'apps'],
  testMatch: ['<rootDir>/**/*.spec.ts'],
  setupFiles: ['regenerator-runtime/runtime'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.build.json',
      babelConfig: true,
    },
  },
};
