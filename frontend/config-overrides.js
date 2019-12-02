const disableChunks = require('react-app-rewire-disable-chunks');

module.exports = function override(config, env) {
  disableChunks(config, env);
  config.output.filename = 'caltrack.js';
  return config;
}
