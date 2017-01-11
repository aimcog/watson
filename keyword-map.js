var keywords = [ "rosemary", "granat", "topas", "baseball" ];

// The location of files wrt to the server root. Each entry corresponds
// to one entry in `keywords` array above.
var mappings = {
    'rosemary': 'images/rosemary.jpg',
    'granat'  : 'images/granat.jpg',
    'topas'   : 'images/topas.jpg',
    'baseball': 'images/baseball.jpg'
}

function getKeywordAndImageLink (word) {
    console.log("Keyword-map", word);
    if (word) {
        var key = word.trim().toLowerCase();
        console.log("Keyword-key", key);
        
        for(var i = 0; i < keywords.length; i++) {
            var keyword = keywords[i];
            if (keyword === key || key.search(keyword) >= 0)
                return keyword + "," + mappings[keyword];
        }

        return "";
    }
}

module.exports = {
    getKeywordAndImageLink : getKeywordAndImageLink
}
