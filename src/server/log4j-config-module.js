exports.config = function() {
  var envJSON = require('../log4j-config.json');
  var node_env = process.env.NODE_ENV || 'development';
  return envJSON[node_env];
}