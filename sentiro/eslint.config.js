const expo = require('eslint-config-expo/flat');

module.exports = [
  ...expo,
  {
    // Build-time helper scripts run in Node, not in the app bundle.
    files: ['tools/**/*.js', 'eslint.config.js'],
    languageOptions: {
      globals: { require: 'readonly', module: 'writable', __dirname: 'readonly', Buffer: 'readonly', console: 'readonly', process: 'readonly' },
    },
  },
  { ignores: ['node_modules/**', 'dist/**', '.expo/**'] },
];
