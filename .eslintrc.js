module.exports = {
    env: {
      browser: false,
      es2021: true,
      node: true,
    },
    extends: ['eslint:recommended', 'prettier'],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    plugins: ['prettier'],
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'warn',
    },
  };