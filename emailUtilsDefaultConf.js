'use strict';

module.exports = {
  apiKey: null, //override
  defaultFrom: null, //override
  sendEmailApiUrl: 'https://api.huhumails.com/api/v1/send-email',
  dontEmail: false, // if you only like to log (for testing purposes)
  emailOneByOne: true, // as suggested by aws
  delayPerEmailMs: 20,
  bodyTransform: null, // can use markdown if you want, function(bodyText){}
}