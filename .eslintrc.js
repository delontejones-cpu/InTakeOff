module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'security'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  env: {
    node: true,
    es2022: true
  },
  rules: {
    // Security rules for HIPAA compliance
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-fs-filename': 'warn',
    'security/detect-possible-timing-attacks': 'warn',
    'security/detect-unsafe-regex': 'error',
    
    // TypeScript specific rules
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    
    // General code quality
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'error'
  },
  overrides: [
    {
      files: ['apps/parent-portal/**/*.{js,jsx,ts,tsx}', 'apps/staff-dashboard/**/*.{js,jsx,ts,tsx}'],
      extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
      plugins: ['react', 'react-hooks'],
      env: {
        browser: true
      },
      settings: {
        react: {
          version: 'detect'
        }
      },
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off'
      }
    },
    {
      files: ['apps/api/**/*.{js,ts}'],
      rules: {
        'no-console': 'off' // Allow console logs in API for logging
      }
    }
  ]
};