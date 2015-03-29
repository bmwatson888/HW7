var main = function () {
    "use strict";

    var insertIntoDOM = function (myJson) {
        var obj = JSON.parse(myJson)
        $("p").text("Enter a URL above to begin!");
    };

    $.getJSON("/results.json", insertIntoDOM);
};

$(document).ready(main);

function postURL () {
    var name = document.getElementById("name").value;
    var yourURL = function (myJson) {
        var obj = JSON.parse(myJson)
        $("p").html("Your URL: " + obj.shortURL);
    };

    $.post("/" + name, yourURL, 'json');
};
