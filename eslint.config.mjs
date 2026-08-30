import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

// eslint-config-next ships a native flat config, so no eslintrc compat shim is
// needed — routing it through FlatCompat under ESLint 9 throws on a circular
// plugin reference.
export default tseslint.config(
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'artifacts/**',
      'design/**',
      'next-env.d.ts',
      '.lighthouseci/**',
    ],
  },
  ...nextCoreWebVitals,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.name='setTimeout'][arguments.length<2]",
          message: 'setTimeout must be given an explicit delay.',
        },
      ],
    },
  },
  {
    files: ['scripts/**/*.mjs', '*.config.{ts,mjs,cjs,js}', 'tests/**/*.{ts,tsx}'],
    rules: { 'no-console': 'off' },
  },
  prettier
);
