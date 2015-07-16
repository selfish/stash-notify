/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * 15/07/2015.
 */




chrome.runtime.sendMessage({getPRdiv: true}, function (response) {
    // Add base for relative URLs:
    var bt = document.createElement("base");
    bt.setAttribute("href", response.host);
    document.getElementsByTagName("head")[0].appendChild(bt);

    // Add css:
    var cssHref = chrome.extension.getURL("/src/browser_action/browser_action.css");
    var cssLink = $("<link rel='stylesheet' type='text/css' href='" + cssHref + "'>");
    $("head").append(cssLink);

    // Fill in content:
    document.getElementById('body').innerHTML = (localStorage.div || '<div style="padding: 20px;">Loading...</div>');
    var remove = ['.spinner', '.aui-avatar-project'];//, '.source', '.destination'];
    remove.forEach(function (selector) {
        $(selector).each(function () {
            this.remove()
        })
    });
    $("a").attr("target", "_blank");
    // Break rows:

    $('tr').each(function () {
        var newTR = $('<tr>');
        $.each(this.attributes, function() {
            newTR.attr(this.name, this.value);
        });
        //var cToMove = [1,5,5,5];
        var cToMove = [6,6,6];

        var oldTR = this;
        cToMove.forEach(function (i) {
            newTR.insertAfter(oldTR).append($('th:eq(' + i + '), td:eq(' + i + ')', oldTR));
        })
    });
    //$('.title').attr('colspan',2);
    $('.source').attr('colspan',2);
    $('.destination').attr('colspan',2);
    $('.updated').attr('colspan',2);

});