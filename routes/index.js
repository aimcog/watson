var express = require('express');
var router = express.Router();
var Alchemy = require('watson-developer-cloud/alchemy-language/v1');

var alchemy = new Alchemy({
    api_key: process.env.ALCHEMY_APIKEY || '<alchemy_apikey>',
});
var alchemy_params = {
    text: 'transcript'
};
   
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/alchemy', function(req, res, next) {
    console.log(req);
    alchemy.sentiment(alchemy_params, function(err, response) {
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
