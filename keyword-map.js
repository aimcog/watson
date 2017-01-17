var keywords = [ "rosemary", "granat", "topas",
                 "topaz", "rose mary", "roman",
                 "rose tiles", "rose tile", "aerlox",
                 "double roman", "granat", "mediterraneo",
                 "roof outlet", "tegalit", "tegalit flat"];

// The location of files wrt to the server root. Each entry corresponds
// to one entry in `keywords` array above.
var mappings = {
    'rosemary': 'images/rosemary.jpg',
    'rose mary': 'images/rosemary.jpg',
    'rose tile': 'images/rosemary.jpg',
    'rose tiles': 'images/rosemary.jpg',
    'granat'  : 'images/granat.jpg',
    'topas'   : 'images/topas.jpg',
    'topaz'   : 'images/topas.jpg',
    "aerlox": 'images/aerlox.jpg',
    "roman": 'images/double_roman.jpg',
    "double roman": 'images/double_roman.jpg',
    "mediterraneo": 'images/mediterraneo.jpg',
    "roof outlet": 'images/roof_outlet.jpg',
    "tegalit": 'images/tegalit_flat.jpg',
    "tegalit flat": 'images/tegalit_flat.jpg'
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
