/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * 15/07/2015.
 */



document.getElementById('inbox-pull-requests').click();
setTimeout(function () {
    var elem = document.getElementById('inbox-pull-request-reviewer');
    chrome.runtime.sendMessage({div: elem.innerHTML}, function (response) {
        console.log(response.ok ? "Message OK" : "Message fail.");
    });
}, 500);