'use strict';

const request = require('request-promise-native');
const defaultConf = require('./emailUtilsDefaultConf.js');

exports.email = async function({
  to, fr, subj, body, cc, bcc, conf
}) {

  if (cc || bcc) {
    console.warn("cc bcc doesn't work yet.");
  }

  if (!web.objectUtils.isArray(to)) {
    to = [to];
  }

  conf = Object.assign(
    defaultConf,
    web.plugins['oils-plugin-emailUtils'].conf,
    conf, 
  );

  fr = fr || conf.defaultFrom;

  if (conf.bodyTransform) {
    body = await conf.bodyTransform(body);
  }

  if (conf.emailOneByOne) {
    for (let toEmail of to) {
      await doEmail({to: toEmail, fr, subj, body, cc, bcc, conf});

      if (conf.delayPerEmailMs) {
        await web.sleep(conf.delayPerEmailMs);
      }
    }
  } else {
    await doEmail({to, fr, subj, body, cc, bcc, conf});
  }

}


exports.normalizeEmail = function(origEmail) {
  throw new Error("Use validator normalizeEmail");
}

exports.isValidEmail = function(email) {
  throw new Error("Use validator isEmail");
}

async function doEmail({
  to, fr, subj, body, cc, bcc, conf
}) {

  const form = {
    to: to,
    fr: fr,
    subj: subj,
    body: body,
    apiKey: conf.apiKey
  };

  validateForm(form);

  if (conf.dontEmail) {
    console.warn("Not sending email because of config:\n", 
      Object.assign({}, form, {apiKey: '[redacted]'}));
    return;
  }

  if (web.conf.isDebug) {
    console.debug('Sending with conf', Object.assign({}, conf, {apiKey: '[redacted]'}), 
      "\n\nEmail form:", Object.assign({}, form, {apiKey: '[redacted]'}));
  }

  try {
    await request.post({url: conf.sendEmailApiUrl, form: form});
    console.log("Email sent", to);
  } catch (ex) {
    console.error("Error sending email", ex, Object.assign({}, form, {apiKey: '[redacted]'}));
  }
}


function validateForm(form) {
  if (web.stringUtils.isEmpty(form.fr)) {
    throw new Error("param fr (from) is required");
  }

  if (web.stringUtils.isEmpty(form.to)) {
    throw new Error("param to is required");
  }

  if (web.stringUtils.isEmpty(form.apiKey)) {
    throw new Error("apiKey is required");
  }
}
