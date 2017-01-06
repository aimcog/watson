var express = require('express');
var router = express.Router();
var Alchemy = require('watson-developer-cloud/alchemy-language/v1');
var config  = require('../config')

var alchemy = new Alchemy({
    api_key: config.ALCHEMY_APIKEY
});
var alchemy_params = {
    text: 'transcript'
};
   
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/alchemy', function(req, res, next) {
    console.log(req.body);
    alchemy.sentiment({
        text: req.body.data
    }, function(err, response) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(response);
            res.send(response);
        }
    });
});

module.exports = router;
