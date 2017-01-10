'use strict';

var express = require('express'),
    router = express.Router(), // eslint-disable-line new-cap
    vcapServices = require('vcap_services'),
    extend = require('util')._extend,
    watson = require('watson-developer-cloud'),
    config = require('./config');

var sttConfig = extend({
    version: 'v1',
    url: 'https://stream.watsonplatform.net/speech-to-text/api',
    username: config.STT_USERNAME,
    password: config.STT_PASSWORD 
}, vcapServices.getCredentials('speech_to_text'));

var sttAuthService = watson.authorization(sttConfig);

router.get('/token', function(req, res) {
    sttAuthService.getToken({url: sttConfig.url}, function(err, token) {
        if (err) {
            console.log('Error retrieving token: ', err);
            res.status(500).send('Error retrieving token');
            return;
        }
        res.send(token);
    });
});

module.exports = router;
