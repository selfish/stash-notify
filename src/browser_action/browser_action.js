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
    var remove = ['.spinner', '.source', '.destination', '.aui-avatar-project'];
    remove.forEach(function (selector) {
        $(selector).each(function () {
            this.remove()
        })
    });
    $("a").attr("target", "_blank");
});