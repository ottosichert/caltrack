const disableChunks = require('react-app-rewire-disable-chunks');
const webpack = require('webpack');

module.exports = function override(config, env) {
  disableChunks(config, env);

  // set deterministic build file name
  config.output.filename = 'caltrack.js';

  // disable hot reloading
  config.entry = config.entry.filter(entry => !/webpack.*hot/i.test(entry));
  config.plugins = config.plugins.filter(plugin => !(plugin instanceof webpack.HotModuleReplacementPlugin));

  return config;
}
