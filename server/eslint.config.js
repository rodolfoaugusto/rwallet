module.exports = [
  {
    files: ['**/*.js'],
    rules: {
      semi: 0,
      'no-param-reassign': 'error',
      'no-console': 'error',
      'prefer-const': 'error',
      'no-unused-vars': 'error',
      'no-unreachable': 'error', // Already in ts, but perhaps it catches more cases
    },
  },
];
