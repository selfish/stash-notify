// Check whether new version is installed

var DEFAULT_INTERVAL = 120000;
var MIN_INTERVAL = 10000;

initSettings();

chrome.runtime.onInstalled.addListener(function (details) {
    chrome.tabs.create({
        url: "/src/options_custom/index.html"
    });
    if (details.reason == "install") {
        initSettings(true);
        console.log("First install");
    } else if (details.reason == "update") {
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion);
    }
});

function go() {

    function main() {
        return new Promise(function (resolve, reject) {
            if (!localStorage._refreshInterval.length > 5)
                localStorage._refreshInterval = DEFAULT_INTERVAL;
            return resolve();
        });
    }

    main()
        .then(getMyRequestsData)
        .then(getPullRequestData)
        .then(notifyPullRequests)
        .then(function () {
            chrome.runtime.sendMessage({loaded: true});
            // Schedule next time:
            setTimeout(go, Math.max(Number(localStorage._notifyInterval), MIN_INTERVAL) || DEFAULT_INTERVAL);
            return Promise.resolve()
        }).catch(errHandle);
}

go();