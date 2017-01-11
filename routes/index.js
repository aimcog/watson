var express = require('express');
var router = express.Router();
var Alchemy = require('watson-developer-cloud/alchemy-language/v1');
var config  = require('../config');
var keywordMap = require('../keyword-map');

var alchemy = new Alchemy({
    api_key: config.ALCHEMY_APIKEY
});
   
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('google');
});

router.get('/api/keywords/:keyword', function(req, res, next) {
    console.log("Keywords: ", req.params);
    var imageInfo = keywordMap.getKeywordAndImageLink(req.params.keyword);
    console.log("Imagelink: ", imageInfo);
    res.send(imageInfo);
});

router.post('/api/alchemy', function(req, res, next) {
    //console.log(req.body);

    var alchemy_params = {
        extract: 'keywords,doc-sentiment,doc-emotion',
        text: req.body.data,
        language: 'english'
    };
    
    console.log(alchemy_params);
    
    alchemy.combined(alchemy_params, function(err, response) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(response);
            res.send(response);
        }
    });
});



module.exports = router;
