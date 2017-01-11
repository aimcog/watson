var keywords = [ "rosemary", "granat", "topas", "baseball" ];

// The location of files wrt to the server root. Each entry corresponds
// to one entry in `keywords` array above.
var mappings = {
    'rosemary': 'images/rosemary.jpg',
    'granat'  : 'images/granat.jpg',
    'topas'   : 'images/topas.jpg',
    'baseball': 'images/baseball.jpg'
}

function getImageLink (word) {
    console.log("Keyword-map", word);
    if (word) {
        var key = word.trim().toLowerCase();

        for(var i = 0; i < keywords.length; i++) {
            if (keywords[i] === key || key.search(keywords[i]) >= 0)
                return mappings[keywords[i]];
        }

        return "";
    }
}

module.exports = {
    getImageLink : getImageLink
}
