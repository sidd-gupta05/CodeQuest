// .eslintrc.js
module.exports = {
  root: true,
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'build/',
    'dist/',
    'prisma/',
    'lib/generated/',
    '*.d.ts',
    '*.config.js',
    '*.config.mjs',
    'coverage/',
    '.turbo/'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next',
    'next/core-web-vitals',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    'prefer-const': 'error',
  },
};
