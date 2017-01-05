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
            var alchemy = document.querySelector('#alchemy-output');
            alchemy.innerHTML = "";
            if (output) {
                //console.log(output);
                fetch('/api/alchemy', {
                    method: 'post',
                    body: JSON.stringify(output)
                }).then(function(response) {
                    return response.json();
                }).then(function(response) {
                    if (response.status === 'OK') {
                        alchemy.innerHTML = response.docSentiment.type;
                    }
                    console.log(response);
                });

            }
        });
        
        
        document.querySelector('#stop').onclick = stream.stop.bind(stream);
    }).catch(function(error) {
        console.log(error);
    });
};
