"use strict";

//read query string parameters
(function ($) {
    $.getParam = function (key) {
        //get querystring(s) without the ?
        var urlParams = decodeURI( window.location.search.substring(1));

        //if no querystring, return null
        if (urlParams === false || urlParams === '') {
            return null;
        }

        //get key/value pairs
        var pairs = urlParams.split("&");
        var keyValue_Collection = {};
        var value;
        var equalsignPosition;
        for (value in pairs) {
            //let's get the position of the first occurrence of "=", in case value has "=" in it
            equalsignPosition = pairs[value].indexOf("=");
            if (equalsignPosition === -1) {
                //in case there's only the key, e.g: http://7php.com/?niche
                keyValue_Collection[pairs[value]] = ''; //you could change the value to true as per your needs
            } else {
                keyValue_Collection[pairs[value].substring(0, equalsignPosition)] = pairs[value].substr(equalsignPosition + 1);
            }
        }
        return keyValue_Collection[key];
    };
})
(jQuery);