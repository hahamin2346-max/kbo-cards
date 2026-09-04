import js from '@eslint/js'

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } }, globals: { document: 'readonly' } },
    rules: { 'no-unused-vars': 'warn', 'no-undef': 'error' },
  },
  {
    files: ['electron/**/*.cjs'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'commonjs', globals: { __dirname: 'readonly', process: 'readonly', require: 'readonly' } },
    rules: { 'no-undef': 'error' },
  },
]
