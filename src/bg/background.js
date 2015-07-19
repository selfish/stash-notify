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

function go() {
    async.waterfall([
        function (cb) {
            if (!localStorage["store.settings.refreshInterval"].length > 5)
                localStorage["store.settings.refreshInterval"] = DEFAULT_INTERVAL;

            localStorage["settings.server"] = localStorage["store.settings.server"].replace(/^"|\/"$|"$/g, '');
            cb();
        },
        getPullRequestData,
        notifyPullRequests
    ], function (err) {
        chrome.runtime.sendMessage({loaded: true});
    });

    // Schedule nex time:
    var interval = localStorage["store.settings.notifyInterval"];
    setTimeout(go, Math.max(Number(interval.replace(/^"|"$/g, '')), MIN_INTERVAL) || DEFAULT_INTERVAL);
}

go();