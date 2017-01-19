var langs =
    [['Afrikaans',       ['af-ZA']],
     ['Bahasa Indonesia',['id-ID']],
     ['Bahasa Melayu',   ['ms-MY']],
     ['Catal',          ['ca-ES']],
     ['Cetina',         ['cs-CZ']],
     ['Deutsch',         ['de-DE']],
     ['English',         ['en-AU', 'Australia'],
      ['en-CA', 'Canada'],
      ['en-IN', 'India'],
      ['en-NZ', 'New Zealand'],
      ['en-ZA', 'South Africa'],
      ['en-GB', 'United Kingdom'],
      ['en-US', 'United States']],
     ['Espaol',         ['es-AR', 'Argentina'],
      ['es-BO', 'Bolivia'],
      ['es-CL', 'Chile'],
      ['es-CO', 'Colombia'],
      ['es-CR', 'Costa Rica'],
      ['es-EC', 'Ecuador'],
      ['es-SV', 'El Salvador'],
      ['es-ES', 'Espaa'],
      ['es-US', 'Estados Unidos'],
      ['es-GT', 'Guatemala'],
      ['es-HN', 'Honduras'],
      ['es-MX', 'Mxico'],
      ['es-NI', 'Nicaragua'],
      ['es-PA', 'Panam'],
      ['es-PY', 'Paraguay'],
      ['es-PE', 'Per'],
      ['es-PR', 'Puerto Rico'],
      ['es-DO', 'Repblica Dominicana'],
      ['es-UY', 'Uruguay'],
      ['es-VE', 'Venezuela']],
     ['Euskara',         ['eu-ES']],
     ['Franais',        ['fr-FR']],
     ['Galego',          ['gl-ES']],
     ['Hrvatski',        ['hr_HR']],
     ['IsiZulu',         ['zu-ZA']],
     ['slenska',        ['is-IS']],
     ['Italiano',        ['it-IT', 'Italia'],
      ['it-CH', 'Svizzera']],
     ['Magyar',          ['hu-HU']],
     ['Nederlands',      ['nl-NL']],
     ['Norsk bokml',    ['nb-NO']],
     ['Polski',          ['pl-PL']],
     ['Portugus',       ['pt-BR', 'Brasil'],
      ['pt-PT', 'Portugal']],
     ['Romna',          ['ro-RO']],
     ['Slovencina',      ['sk-SK']],
     ['Suomi',           ['fi-FI']],
     ['Svenska',         ['sv-SE']],
     ['Trke',          ['tr-TR']],
     ['?????????',       ['bg-BG']],
     ['P??????',         ['ru-RU']],
     ['??????',          ['sr-RS']],
     ['???',            ['ko-KR']],
     ['??',             ['cmn-Hans-CN', '??? (????)'],
      ['cmn-Hans-HK', '??? (??)'],
      ['cmn-Hant-TW', '?? (??)'],
      ['yue-Hant-HK', '?? (??)']],
     ['???',           ['ja-JP']],
     ['Lingua latina',   ['la']]];

//for (var i = 0; i < langs.length; i++) {
// select_language.options[i] = new Option(langs[i][0], i);
//}
select_language.selectedIndex = 6;
updateCountry();
select_dialect.selectedIndex = 6;
showInfo('info_start');

function updateCountry() {
    for (var i = 2 - 1; i >= 0; i--) {
        // select_dialect.remove(i);
    }
    var list = langs[select_language.selectedIndex];
    for (var i = 1; i < list.length; i++) {
        //  select_dialect.options.add(new Option(list[i][1], list[i][0]));
    }
    select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}

// For showing the product images, we need to keep in memory which
// keywords have already been encountered.
var keywordsReceived = [];
var citiesReceived = [];
var transcript_has_aerlox = false;
var aerlox_enabled = false;

var create_email = false;
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} else {
    start_button.style.display = 'inline-block';
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function() {
        recognizing = true;
        showInfo('info_speak_now');
        start_img.src = '/images/mic-animate.gif';
        document.getElementById('sentiment-output').innerHTML = '';
        document.getElementById('emotion-output').innerHTML = '';
        document.getElementById('image-placeholder').innerHTML = '';
        keywordsReceived = [];
        transcript_has_aerlox = false;
        remove_aerlox_video();
    };

    recognition.onerror = function(event) {
        if (event.error == 'no-speech') {
            start_img.src = 'images/mic.gif';
            showInfo('info_no_speech');
            ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
            start_img.src = 'images/mic.gif';
            showInfo('info_no_microphone');
            ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
            if (event.timeStamp - start_timestamp < 100) {
                showInfo('info_blocked');
            } else {
                showInfo('info_denied');
            }
            ignore_onend = true;
        }
    };

    recognition.onend = function() {
        recognizing = false;
        if (ignore_onend) {
            return;
        }
        start_img.src = 'images/mic.gif';
        if (!final_transcript) {
            showInfo('info_start');
            return;
        }
        showInfo('');
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
            var range = document.createRange();
            range.selectNode(document.getElementById('final_span'));
            window.getSelection().addRange(range);
        }
        if (create_email) {
            create_email = false;
            createEmail();
        }
    };

    recognition.onresult = function(event) {
        var interim_transcript = '';
        var re_braas = /(brass)/;
        var re_monier = /(money)/;
        var re_aerlox = /(hair locks)/;
        
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        // "lookup"
        final_transcript = final_transcript
            .replace(re_braas, 'braas')
            .replace(re_monier, 'monier')
            .replace(re_aerlox, 'Aerlox');
        
        // There's this high chance that STT is not going to recognize
        // Aerlox as a keyword, so need to check that in the final_transcript,
        // and put up a frame for the video.
        if (/Aerlox/.test(final_transcript) && !aerlox_enabled) {
            show_aerlox_video();
        }

        final_transcript = capitalize(final_transcript);
        final_span.innerHTML = linebreak(final_transcript);
        interim_span.innerHTML = linebreak(interim_transcript);
        if (final_transcript || interim_transcript) {
            showButtons('inline-block');
        }

        var output = document.querySelector('#final_span').innerHTML;
        var sentiment = document.querySelector('#sentiment-output');
        var emotion = document.querySelector('#emotion-output');
        var keywords = document.querySelector('#keywords-output');
        var cities = document.querySelector('#cities-output');
        
        sentiment.innerHTML = "";
        emotion.innerHTML = "";
        keywords.innerHTML = "";
        cities.innerHTML = "";
        
        var alchemy_data = {data: output};
        if (output) {
            jQuery.post('/api/alchemy', alchemy_data)
                .done(function(data) {
                    console.log(data);
                    var data_sentiment = data.docSentiment.type;
                    get_keywords(data.keywords);

                    
                    sentiment.innerHTML = data_sentiment;
                    var data_emotions = "";
                    for (var key in data.docEmotions) {
                        data_emotions += '<p>' + key + ': ' + data.docEmotions[key] + '<p>';
                    }
                    emotion.innerHTML = data_emotions;

                    var data_keywords = "";
                    for(var i = 0; i < data.keywords.length; i++) {
                        var o = data.keywords[i];  // An object with 'text' and 'relevance'
                        // These should be `ul>li` but that will require css. 
                        data_keywords += '<p>' + o.text + '</p>';
                    }
                    keywords.innerHTML = data_keywords;
                    
                    cities.innerHTML = "";
                    populate_cities(data.entities);

                    remove_duplicates_from_keywords(keywordsReceived, citiesReceived);
                    
                    console.log(data); 
                });
        }

        
    };
}

function show_aerlox_video() {
    if (!aerlox_enabled) {
        aerlox_enabled = true;

        var aerlox_container = document.querySelector('#aerlox-container');

        var iframe = document.createElement('iframe');
        iframe.id = 'aerlox-iframe';
        iframe.height = 316;
        iframe.width = 560;
        iframe.src = "https://www.youtube.com/embed/xe8qWTbDkkQ?autoplay=1";
        iframe.frameborder = 0;
        aerlox_container.appendChild(iframe);
    }
}

function remove_aerlox_video() {
    aerlox_enabled = false;
    var iframe = document.querySelector('#aerlox-iframe');
    if (iframe) {
        iframe.remove();
    }
}

function remove_duplicates_from_keywords(keywords, cities) {

    
    
}

function populate_cities(entities) {
    var cities_output = document.querySelector('#cities-output');
    entities.map(function(entity) {
        if (entity.type === 'City' ||
            entity.type === 'StateOrCounty' ||
            entity.type === 'Country') {
            var city = document.createElement('p');
            city.classList.add('city');
            city.innerText = entity.text;
            cities_output.appendChild(city);
            citiesReceived.push(entity.text);
        }
    });

}

function get_keywords(keywords) {
    var imageHolder = document.querySelector('#image-placeholder');
                    
    for(var i = 0; i < keywords.length; i++) {
        var keyword = keywords[i];
        
        jQuery.get('/api/keywords/' + keyword.text)
            .done(function(linkObj) {
                console.log(linkObj);
                var parts = linkObj.split(',');
                if (parts.length == 2) {
                    var keyword = parts[0];
                    var link = parts[1];
                    // Image not found in the memory ds, add it to the
                    // page
                    if (link &&
                        keywordsReceived.indexOf(keyword) == -1) {

                        keywordsReceived.push(keyword);
                        var li = document.createElement('li');
                        var img = document.createElement('img');
                        console.log(link);
                        img.setAttribute('src', link);
                        img.classList.add('product');
                        li.appendChild(img);
                        imageHolder.appendChild(li);
                    }
                }
            });
    }
}

function upgrade() {
    start_button.style.visibility = 'hidden';
    showInfo('info_upgrade');
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
    return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function createEmail() {
    var n = final_transcript.indexOf('\n');
    if (n < 0 || n >= 80) {
        n = 40 + final_transcript.substring(40).indexOf(' ');
    }
    var subject = encodeURI(final_transcript.substring(0, n));
    var body = encodeURI(final_transcript.substring(n + 1));
    window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
}

function copyButton() {
    if (recognizing) {
        recognizing = false;
        recognition.stop();
    }
    copy_button.style.display = 'none';
    copy_info.style.display = 'inline-block';
    showInfo('');
}

function emailButton() {
    if (recognizing) {
        create_email = true;
        recognizing = false;
        recognition.stop();
    } else {
        createEmail();
    }
    email_button.style.display = 'none';
    email_info.style.display = 'inline-block';
    showInfo('');
}

function startButton(event) {
    if (recognizing) {
        recognition.stop();
        return;
    }
    final_transcript = '';
    recognition.lang = select_dialect.value;
    recognition.start();
    ignore_onend = false;
    final_span.innerHTML = '';
    interim_span.innerHTML = '';
    start_img.src = 'images/mic-slash.gif';
    showInfo('info_allow');
    showButtons('none');
    start_timestamp = event.timeStamp;
}

function showInfo(s) {
    if (s) {
        for (var child = info.firstChild; child; child = child.nextSibling) {
            if (child.style) {
                child.style.display = child.id == s ? 'inline' : 'none';
            }
        }
        info.style.visibility = 'visible';
    } else {
        info.style.visibility = 'hidden';
    }
}

var current_style;
function showButtons(style) {
    if (style == current_style) {
        return;
    }
    current_style = style;
    copy_button.style.display = style;
    email_button.style.display = style;
    copy_info.style.display = 'none';
    email_info.style.display = 'none';
}
