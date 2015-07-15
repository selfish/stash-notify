// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function (details) {
    chrome.tabs.create({
        url: "/src/options_custom/index.html"
    });
    if (details.reason == "install") {
        console.log("This is a first install!");

    } else if (details.reason == "update") {
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});

// Responder:

function go() {

    var host = localStorage["store.settings.server"].replace(/"/g, '');
    localStorage["store.settings.server"] = host;
    if (host[host.length - 1] == "/") {
        localStorage["store.settings.password"] = host.substring(0, host.length - 1);
    }

    getPullRequestCount();
    getPRElement();

    setTimeout(go, Math.max(Number(localStorage["store.settings.refreshInterval"].replace(/"/g,'')), 10000) || 10000)
}

if (!localStorage["store.settings.refreshInterval"].length)
    localStorage["store.settings.refreshInterval"] = 60000;
go();
