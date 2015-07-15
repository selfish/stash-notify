/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * 14/07/2015.
 */

var pullRequestsURL = '/rest/inbox/latest/pull-requests?role=reviewer&start=0&limit=10&avatarSize=64&state=OPEN&order=oldest';
var loginURL = '/login';

function notifyPullRequest(pr) {

    var prID = pr.links.self[0].href;

    var repeat = !!localStorage["store.settings.repeatUntilNoticed"];

    if (localStorage["click." + prID]) return;
    if (!repeat && localStorage["notif." + prID]) return;
    chrome.notifications.clear(prID);

    localStorage["notif." + prID] = 1;
    chrome.notifications.create(prID, {
        type: "basic",
        message: pr.title,
        title: pr.author.user.displayName,
        iconUrl: localStorage["store.settings.server"] + pr.author.user.avatarUrl.split("?")[0]
    }, function () {
        chrome.notifications.onClicked.addListener(function (prID) {
            window.open(prID);
            localStorage["click." + prID] = 1;
        });
    });
}

function getPullRequestCount() {
    var host = localStorage["store.settings.server"];

    // TODO: Improve
    if (!host) return;

    var uri = (host + pullRequestsURL).replace("/" + pullRequestsURL, pullRequestsURL);

    najax(uri, function (err, res) {
        if (err) {
            errHandle(err);
        } else {
            setBadge(res.size, null, "#ff0000");
            if (localStorage["store.settings.notify"] == "true")
                res.values.forEach(notifyPullRequest);
        }
    });
}

function login(done) {

    if (!JSON.parse(localStorage["store.settings.login"])) return done();

    var uri = (localStorage["store.settings.server"] + loginURL).replace("/" + loginURL, loginURL);

    chrome.tabs.create({
        url: uri,
        active: false
    }, function (tab) {
        chrome.tabs.executeScript(tab.id, {
            runAt: 'document_end',
            file: '/src/content_script/stashReportTasks.js'
        }, function () {
            chrome.tabs.remove(tab.id);
            done();
        });
    });
}

function extract() {

    var uri = localStorage["store.settings.server"];

    chrome.tabs.create({
        url: uri,
        active: false
    }, function (tab) {
        chrome.tabs.executeScript(tab.id, {
                runAt: 'document_end',
                file: '/src/lib/jquery-2.1.1.min.js'
            },
            function () {
                chrome.tabs.executeScript(tab.id, {
                    runAt: 'document_end',
                    file: '/src/content_script/stashReportTasks.js'
                }, function () {

                    console.log('executed');
                });
            });
    });
}

function getPRElement() {
    if (!localStorage["store.settings.server"]) return;
    login(function () {
        setTimeout(extract, 1000)
    });
}
