module.exports = {

  // Environments

  isDevelopment: function () {
    return this.getEnvironment() === 'development';
  },

  isProduction: function () {
    return this.getEnvironment() === 'production';
  },

  // Accessors

  getEnvironment: function () {
    return process.env.ENV || 'development';
  },

  quitOnUnload: function () {
    return !!process.env.UNLOAD;
  },

  getPort: function () {
    return process.env.PORT || 8080;
  },

  getHostName: function () {
    return process.env.HOSTNAME || 'localhost';
  },

  // Settings

  getTickHertz: function () {
    return 5;
  },

  getMaxClients: function () {
    return 32;
  },

  // Feature flags

  supportsAutoReload: function () {
    return true;
  }
};
