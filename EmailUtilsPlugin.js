'use strict';

const emailUtils = require('./emailUtils.js');

class EmailUtilsPlugin extends web.Plugin {

  constructor(conf, id) {
    super(conf, id);
  }

  load(pluginConf, web, next) {
    Object.defineProperty(web, 'emailUtils', {
      get: function() {
        return emailUtils;
      }
    });

    next();
  }
}

module.exports = EmailUtilsPlugin;