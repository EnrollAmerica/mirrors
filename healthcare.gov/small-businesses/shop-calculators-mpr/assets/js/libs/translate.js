/*
* Get and set polyglot object for performing language translation throughout the app
*/

function language(lang) {
    var polyglot = new Polyglot();
    var lang_content = {};
    var url = 'assets/js/app/lang/' + lang + '.json';
    $.ajax({
        url: url,
        async: false,
        dataType: 'json', // Sometimes we can't rely on the server to have the correct mimetype
        success: function (data) {
            lang_content = data;
        }
    });

    polyglot.locale(lang);
    polyglot.extend(lang_content);
    return polyglot;
}
