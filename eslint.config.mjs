// eslint.config.mjs
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import next from '@next/eslint-plugin-next';

export default [
  // Ignore patterns
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/build/**',
      '**/dist/**',
      '**/prisma/**',
      '**/lib/generated/**',
      '**/*.d.ts',
      '**/*.config.js',
      '**/*.config.mjs',
      '**/coverage/**',
      '**/.turbo/**'
    ],
  },
  
  // JavaScript/TypeScript base config
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescript,
      '@next/next': next,
    },
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      'prefer-const': 'error',
    },
  },
];