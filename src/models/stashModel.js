/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * 14/07/2015.
 */

var pullRequestsURL = '/rest/inbox/latest/pull-requests?role=reviewer&start=0&limit=10&avatarSize=64&state=OPEN&order=oldest';

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
    if (!(localStorage["store.settings.snooze_this_btn"] == 'true')) {
        buttons.push({title: "Snooze this Pull Request", iconUrl: "/assets/snooze.svg"});
    }
    if (!(localStorage["store.settings.snooze_all_btn"] == 'true')) {
        buttons.push({title: "Snooze all", iconUrl: "/assets/zzz.svg"});
    }

    chrome.notifications.clear(prID, null);
    chrome.notifications.create(prID, {
        type: "basic",
        message: pr.title,
        title: pr['author']['user']['displayName'],
        iconUrl: localStorage["settings.server"] + pr['author']['user']['avatarUrl'].split("?")[0],
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


function filterResult(data) {

    if (localStorage["store.settings.scrum_master"] == "true"
        && localStorage["store.settings.username"]
        && localStorage["store.settings.username"].length
    ) {
        data.values = _.filter(data.values, function (pr) {
            // If I'm the only reviewer, display:
            if (pr["reviewers"].length == 1) return true;
            // Else, if at least one other had reviewed:
            return _.some(pr["reviewers"], function (rev) {
                return (
                    rev['approved'] == true
                    && rev['user']['name'] != localStorage["store.settings.username"]
                );
            });
        });
        data.size = data.values.length;
    }
    return data;
}

function getPullRequestData(cb) {

    var host = localStorage["settings.server"];
    // TODO: Improve
    if (!host) return;
    var uri = (host + pullRequestsURL).replace("/" + pullRequestsURL, pullRequestsURL);
    najax(uri, function (err, res) {
        if (err) {
            errHandle(err);
        } else {
            // Filter for Scrum master:
            res = filterResult(res);
            // Update badge:
            if (res.size == 0) clearBadge();
            else setBadge(res.size, null, "#ff0000");
            // Save:
            localStorage.prData = JSON.stringify(res);
            cb(res);
        }
    });
}


function getPullRequestCount(notify) {
    getPullRequestData(function (PRData) {
        if (notify && localStorage["store.settings.notify"] == "true" && !(localStorage['snooze_all'] > Date.now()))
            PRData.values.forEach(notifyPullRequest);
    });
}
