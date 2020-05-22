module.exports = {
  extends: [
    '@unicefnz/eslint-config/ts-react'
  ],
  rules: {
    'import/prefer-default-export': 0
  },
  parserOptions: {
    project: './tsconfig.json'
  },
  ignorePatterns: ['build']
};
