module.exports = {
  plugins: ['security', 'jest', 'mocha', 'promise'],
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:security/recommended',
    'plugin:node/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
    'plugin:promise/recommended',
  ],
  env: {
    node: true,
    'jest/globals': true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'node/exports-style': ['error', 'module.exports'],
    'node/prefer-global/url': ['error', 'always'],
    'node/no-missing-require': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 1,
    '@typescript-eslint/no-inferrable-types': [
      'warn',
      {
        ignoreParameters: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': 'warn',
    'node/no-deprecated-api': [
      'error',
      {
        ignoreModuleItems: [],
        ignoreGlobalItems: [],
      },
    ],
    'node/no-unpublished-bin': [
      'error',
      {
        convertPath: null,
      },
    ],
    'node/no-extraneous-require': [
      'error',
      {
        allowModules: [],
      },
    ],
    'node/no-unpublished-require': [
      'error',
      {
        allowModules: [],
      },
    ],
    'node/no-unsupported-features/es-builtins': [
      'error',
      {
        ignores: [],
      },
    ],
    'node/no-unsupported-features/es-syntax': [
      'error',
      {
        ignores: [],
      },
    ],
    'node/no-unsupported-features/node-builtins': [
      'error',
      {
        ignores: [],
      },
    ],
    'capitalized-comments': [
      'error',
      'always',
      {
        ignorePattern: 'pragma|ignored',
        ignoreInlineComments: true,
      },
    ],
    'mocha/no-exclusive-tests': 'error',
    'mocha/no-global-tests': 'error',
    'mocha/no-identical-title': 'error',
    'mocha/no-nested-tests': 'error',
    'mocha/valid-suite-description': [1, '^[A-Z]'],
  },
};
