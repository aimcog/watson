var express = require('express');
var router = express.Router();
var Alchemy = require('watson-developer-cloud/alchemy-language/v1');
var config  = require('../config');
var keywordMap = require('../keyword-map');

var alchemy = new Alchemy({
    api_key: config.ALCHEMY_APIKEY
});


router.get('/', function(req, res, next) {
    res.render('google');
});

module.exports = router;
