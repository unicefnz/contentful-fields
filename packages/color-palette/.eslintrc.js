// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@unicefnz/eslint-config/patch');

module.exports = {
  extends: [
    // '@contentful/extension',
    '@unicefnz/eslint-config/react'
  ],
  rules: {
    'import/prefer-default-export': 0
  },
  parserOptions: {
    tsconfigRootDir: __dirname
  },
  ignorePatterns: ['build']
};
