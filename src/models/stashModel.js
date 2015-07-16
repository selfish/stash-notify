/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * 14/07/2015.
 */

var pullRequestsURL = '/rest/inbox/latest/pull-requests?role=reviewer&start=0&limit=10&avatarSize=64&state=OPEN&order=oldest';
var loginURL = '/login';

function notifyPullRequest(pr) {

    var prID = pr.links.self[0].href;

    // Quit if snoozed:
    if (localStorage['snooze.' + prID] > Date.now()) return;

    // Don't show if no repeat:
    if (localStorage["store.settings.repeatUntilNoticed"] == "once"
        && localStorage["notif." + prID])
        return;

    // Don't show if clicked:
    if (localStorage["store.settings.repeatUntilNoticed"] == "click"
        && localStorage["click." + prID])
        return;

    // Prepare buttons:
    var buttons = [];
    if (!localStorage["store.settings.snooze_this_btn"] == 'true') {
        buttons.push({title: "Snooze this Pull Request", iconUrl: "/assets/snooze.svg"});
    }
    if (!localStorage["store.settings.snooze_all_btn"] == 'true') {
        buttons.push({title: "Snooze all", iconUrl: "/assets/zzz.svg"});
    }

    chrome.notifications.clear(prID);
    chrome.notifications.create(prID, {
        type: "basic",
        message: pr.title,
        title: pr.author.user.displayName,
        iconUrl: localStorage["settings.server"] + pr.author.user.avatarUrl.split("?")[0],
        buttons: buttons
    }, function () {
        // Mark as shown:
        localStorage["notif." + prID] = 1;
        chrome.notifications.onClicked.addListener(function (prID) {
            window.open(prID);
            localStorage["click." + prID] = 1;
        });
        chrome.notifications.onButtonClicked.addListener(function (prID, buttonIndex) {
                switch (buttonIndex) {
                    case 0: // Snooze THIS!
                        localStorage['snooze.' + prID] = Date.now() + Number(localStorage["store.settings.snooze_duration"].replace(/"/g, ''));
                        break;
                    case 1: // Snooze ALL!
                        localStorage['snooze_all'] = Date.now() + Number(localStorage["store.settings.snooze_duration"].replace(/"/g, ''));
                        break;
                }
            }
        );
    });
}

function getPullRequestCount(notify) {
    var host = localStorage["settings.server"];

    // TODO: Improve
    if (!host) return;

    var uri = (host + pullRequestsURL).replace("/" + pullRequestsURL, pullRequestsURL);

    najax(uri, function (err, res) {
        if (err) {
            errHandle(err);
        } else {
            if (res.size == 0) clearBadge();
            else setBadge(res.size, null, "#ff0000");

            if (notify && localStorage["store.settings.notify"] == "true" && !(localStorage['snooze_all'] > Date.now()))
                res.values.forEach(notifyPullRequest);
        }
    });
}

function login(done) {

    if (!JSON.parse(localStorage["store.settings.login"])) return done();

    var uri = (localStorage["settings.server"] + loginURL).replace("/" + loginURL, loginURL);

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

    var uri = localStorage["settings.server"];

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
    if (!localStorage["settings.server"]) return;
    login(function () {
        setTimeout(extract, 1000)
    });
}
