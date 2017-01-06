var express = require('express');
var router = express.Router();
var Alchemy = require('watson-developer-cloud/alchemy-language/v1');
var config  = require('../config')

var alchemy = new Alchemy({
    api_key: config.ALCHEMY_APIKEY
});
   
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/alchemy', function(req, res, next) {
    //console.log(req.body);

    var alchemy_params = {
        extract: 'doc-sentiment,doc-emotion',
        text: req.body.data,
        language: 'english'
    };
    
    console.log(alchemy_params);
    
    alchemy.combined(alchemy_params, function(err, response) {
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
