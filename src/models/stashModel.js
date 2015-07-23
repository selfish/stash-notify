/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * 14/07/2015.
 */

var pullRequestsURL = '/rest/inbox/latest/pull-requests?role=reviewer&start=0&limit=10&avatarSize=64&state=OPEN&order=oldest';
var myPullRequestsURL = '/rest/inbox/latest/pull-requests?role=author&start=0&limit=10&avatarSize=64&state=OPEN&order=oldest';

var _listeners = {};

function filterResult(data) {
    data = JSON.parse(data);

    // Open tasks:
    if (localStorage["_hide_pr_with_tasks"] == "true") {
        data.values = _.filter(data.values, function (pr) {
            return !(
                pr['attributes']['openTaskCount']
                && (pr['attributes']['openTaskCount'] != "0")
            );
        });
    }

    // Scrum master:
    if (localStorage["_scrum_master"] == "true"
        && localStorage["_username"]
        && localStorage["_username"].length
    ) {
        data.values = _.filter(data.values, function (pr) {
            // If I'm the only reviewer, display:
            if (pr["reviewers"].length == 1) return true;
            // Else, if at least one other had reviewed:
            return _.some(pr["reviewers"], function (rev) {
                return (
                    rev['approved'] == true
                    && rev['user']['name'] != localStorage["_username"]
                );
            });
        });
    }
    data.size = data.values.length;
    //return data;
    return data;
}

function getPullRequestData() {

    // TODO: Improve
    if (!localStorage._server) return;
    var uri = (localStorage._server + pullRequestsURL).replace("/" + pullRequestsURL, pullRequestsURL);

    return najax(uri)
        .then(filterResult)
        .then(function (res) {
            if (res.size == 0) clearBadge();
            else setBadge(res.size, null, "#ff0000");
            localStorage.prData = JSON.stringify(res);;
            return res;
        })
        .catch(errHandle);
}

function getMyRequestsData() {

    if (!localStorage._server) return;
    var uri = (localStorage._server + myPullRequestsURL).replace("/" + myPullRequestsURL, myPullRequestsURL);

    return najax(uri)
        .then(filterResult)
        .then(function (res) {
            localStorage.prDataMine = JSON.stringify(res);
            return res;
        })
        .catch(errHandle);
}

function notifyPullRequests(PRData) {
    if (localStorage["_notifyPRs"] == "true" && !(localStorage['snooze_all'] > Date.now())) {
        PRData.values.forEach(notifyPullRequest);
    }
    return Promise.resolve();
}

function notifyPullRequest(pr) {

    var prID = pr.links.self[0].href;

    // Quit if snoozed:
    if (localStorage['snooze.' + prID] > Date.now()) return;

    // Don't show if no repeat:
    if (localStorage["_repeatUntilNoticed"] == "once"
        && localStorage["notif." + prID])
        return;

    // Don't show if clicked:
    if (localStorage["_repeatUntilNoticed"] == "click"
        && localStorage["click." + prID])
        return;

    // Prepare buttons:
    var buttons = [];
    if (!(localStorage["_snooze_this_btn"] == 'true')) {
        buttons.push({title: "Snooze this Pull Request", iconUrl: "/assets/snooze.svg"});
    }
    if (!(localStorage["_snooze_all_btn"] == 'true')) {
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
        if (!_listeners[prID]) {
            _listeners[prID] = true;
            chrome.notifications.onClicked.addListener(function (prID) {
                window.open(prID);
                localStorage["click." + prID] = 1;
            });
        }

        chrome.notifications.onButtonClicked.addListener(function (prID, buttonIndex) {
                switch (buttonIndex) {
                    case 0: // Snooze THIS!
                        localStorage['snooze.' + prID] = Date.now() + Number(localStorage["_snooze_duration"].replace(/"/g, ''));
                        break;
                    case 1: // Snooze ALL!
                        localStorage['snooze_all'] = Date.now() + Number(localStorage["_snooze_duration"].replace(/"/g, ''));
                        break;
                }
            }
        );
    });
}