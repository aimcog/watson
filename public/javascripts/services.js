// For showing the product images, we need to keep in memory which
// keywords have already been encountered.
var keywordsReceived = [];

function getTtsToken() {
    return fetch('/api/speech-to-text/token')
        .then(function(response) {
            return response.text();
        });
}
// fetch the models and populate the dropdown
getTtsToken()
    .then(function (token) {
        return WatsonSpeech.SpeechToText.getModels({token: token});
    }).then(function (models) {
        var dropdown = document.querySelector('#model');
        models.forEach(function (m) {
            var o = document.createElement('option');
            o.value = m.name;
            o.textContent = m.name;
            if (m.name == 'en-US_BroadbandModel') {
                o.selected = true;
            }
            dropdown.appendChild(o);
        });
    }).catch(console.error.bind(console));
// recognize the text using the chosen model

document.querySelector('#button').onclick = function () {
    getTtsToken().then(function (token) {
        var stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
            token: token,
            model: document.querySelector('#model').value,
            outputElement: '#output' // CSS selector or DOM Element
        });
        stream.on('error', function(err) {
            console.log(err);
        });

        stream.on('data', function(data) {
            var output = document.querySelector('#output').innerHTML;
            var sentiment = document.querySelector('#sentiment-output');
            var emotion = document.querySelector('#emotion-output');
            var imageHolder = document.querySelector('#image-placeholder');
            
            
            sentiment.innerHTML = "";
            emotion.innerHTML = "";
            var alchemy_data = {data: output};
            if (output) {
                
                jQuery.post('/api/alchemy', alchemy_data)
                    .done(function(data) {
                        console.log(data);
                        var data_sentiment = data.docSentiment.type;
                        var keywords = data.keywords;
                        
                        for(var i = 0; i < keywords.length; i++) {
                            var keyword = keywords[i];
                            
                            jQuery.get('/api/keywords/' + keyword.text)
                                .done(function(linkObj) {
                                    console.log(linkObj);
                                    // Image not found in the memory ds, add it to the
                                    // page
                                    if (linkObj.link &&
                                        keywordsReceived.indexOf(linkObj.keyword) == -1) {

                                        keywordsReceived.push(linkObj.keyword);
                                        var img = document.createElement('img');
                                        console.log(linkObj.link);
                                        img.setAttribute('src', linkObj.link);
                                        imageHolder.appendChild(img);
                                    }
                                });
                        }

                        
                        sentiment.innerHTML = data_sentiment;
                        var data_emotions = "";
                        for (var key in data.docEmotions) {
                            data_emotions += '<p>' + key + ': ' + data.docEmotions[key] + '<p>';
                            emotion.innerHTML = data_emotions;
                        }
                        console.log(data); 
                    });
            }
        });
        
        
        document.querySelector('#stop').onclick = stream.stop.bind(stream);
    }).catch(function(error) {
        console.log(error);
    });
};
