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
    name = name.replace("/","-slashie-");
    //your code to be executed after 1 seconds
     
    var yourURL = function (myJson) {
        var obj = JSON.parse(myJson)
        
        $("p").html("Your URL: <a href='" + obj.shortURL + "' target='_blank'>" + obj.shortURL + "</a>");
    };
    $.post("/" + name, yourURL, 'json');
};
