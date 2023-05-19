const { getESLintConfig } = require('@applint/spec');

module.exports = getESLintConfig('react-ts', {
  rules: {
    'prefer-destructuring': ['off'],
    'id-length': 'off',
  },
});
