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

  getPort: function () {
    return process.env.PORT || 8080;
  },

  getHostName: function () {
    return process.env.HOSTNAME || 'localhost';
  },

  getOpenTokKey: function () {
    return process.env.OPENTOK_KEY;
  },

  getOpenTokSecret: function () {
    return process.env.OPENTOK_SECRET;
  },

  // Feature flags

  supportsAutoReload: function () {
    return this.isDevelopment();
  }
};
