// Check whether new version is installed

var DEFAULT_INTERVAL = 120000;
var MIN_INTERVAL = 10000;

chrome.runtime.onInstalled.addListener(function (details) {
    chrome.tabs.create({
        url: "/src/options_custom/index.html"
    });
    if (details.reason == "install") {
        initSettings(true);
        console.log("First install");
    } else if (details.reason == "update") {
        initSettings();
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion);
    }
});

function go(notify, norepeat) {

    var host = localStorage["store.settings.server"].replace(/"/g, '');
    localStorage["settings.server"] = host;
    if (host[host.length - 1] == "/") {
        host = host.substring(0, host.length - 1);
    }
    localStorage["settings.server"] = host;

    getPullRequestCount(notify);
    getPRElement();

    var interval = notify ?
        localStorage["store.settings.notifyInterval"] :
        localStorage["store.settings.refreshInterval"];

    if (!norepeat)setTimeout(function () {
        go(notify);
    }, Math.max(Number(interval.replace(/"/g, '')), MIN_INTERVAL) || DEFAULT_INTERVAL);
}

if (!localStorage["store.settings.refreshInterval"].length)
    localStorage["store.settings.refreshInterval"] = DEFAULT_INTERVAL;
go(true);
if (localStorage["store.settings.notifyInterval"] != localStorage["store.settings.refreshInterval"]) {
    setTimeout(function () {
        go(false);
    }, Math.max(Number(localStorage["store.settings.refreshInterval"].replace(/"/g, '')), MIN_INTERVAL) || DEFAULT_INTERVAL)
}