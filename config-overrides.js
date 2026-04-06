module.exports = function override(config, env) {
  // Disable host check for CodeSandbox
  if (config.devServer) {
    config.devServer.allowedHosts = 'all';
    config.devServer.client = {
      webSocketURL: 'auto://0.0.0.0:0/ws'
    };
  }
  return config;
};