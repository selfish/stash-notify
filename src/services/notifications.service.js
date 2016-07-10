/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * on 10/07/2016
 */

app.factory('notifications', ['ls', ls => {
    function notify(prs) {
        prs = prs || ls.get('prData');

        if (prs.length) {
            var buttons = [];
            // if (!(localStorage["_snooze_this_btn"] == 'true')) {
            //     buttons.push({title: "Snooze this Pull Request", iconUrl: "../assets/snooze.svg"});
            // }
            if (!(localStorage._snooze_all_btn === 'true')) {
                buttons.push({
                    title: `Snooze notifications for ${ls.get('config').snooze_duration} hours`,
                    iconUrl: '../assets/zzz.svg'
                });
            }

            chrome.notifications.create(Math.random().toString(), {
                type: 'basic',
                message: `${prs.length} pull request${prs.length > 1 ? 's' : ''} pending review`,
                title: `${prs.length > 1 ? 'P' : 'A p'}ull request${prs.length > 1 ? 's are' : ' is'} waiting..!`,
                iconUrl: `../assets/signed/signed${_.random(6) + 1}.svg`,
                buttons: buttons
            });
        }
    }

    // function notifyPullRequest(pr) {
    //
    //     var prID = pr.links.self[0].href;
    //
    //     // Quit if snoozed:
    //     if (localStorage['snooze.' + prID] > Date.now()) return;
    //
    //     // Don't show if no repeat:
    //     if (localStorage._repeatUntilNoticed === 'once'
    //         && localStorage['notif.' + prID])
    //         return;
    //
    //     // Don't show if clicked:
    //     if (localStorage._repeatUntilNoticed === 'click'
    //         && localStorage['click.' + prID])
    //         return;
    //
    //     // Prepare buttons:
    //     var buttons = [];
    //     if (!(localStorage._snooze_this_btn === 'true')) {
    //         buttons.push({title: 'Snooze this Pull Request', iconUrl: '/assets/snooze.svg'});
    //     }
    //     if (!(localStorage._snooze_all_btn === 'true')) {
    //         buttons.push({title: 'Snooze all', iconUrl: '/assets/zzz.svg'});
    //     }
    //
    //     chrome.notifications.clear(prID, null);
    //     chrome.notifications.create(prID, {
    //         type: 'basic',
    //         message: pr.title,
    //         title: pr.author.user.displayName,
    //         iconUrl: host(pr.author.user.avatarUrl.split('?')[0]),
    //         buttons: buttons
    //     }, function () {
    //         // Mark as shown:
    //         if (localStorage['notif.' + prID] != 1) {
    //             chrome.notifications.onClicked.addListener(function (prID) {
    //                 window.open(prID);
    //                 localStorage['click.' + prID] = 1;
    //             });
    //
    //             chrome.notifications.onButtonClicked.addListener(function (prID, buttonIndex) {
    //                     switch (buttonIndex) {
    //                         case 0: // Snooze THIS!
    //                             localStorage['snooze.' + prID] = Date.now() + Number(localStorage._snooze_duration.replace(/"/g, ''));
    //                             break;
    //                         case 1: // Snooze ALL!
    //                             localStorage.snooze_all = Date.now() + Number(localStorage._snooze_duration.replace(/"/g, ''));
    //                             dismissAllNotifications();
    //                             break;
    //                     }
    //                 }
    //             );
    //         }
    //         localStorage["notif." + prID] = 1;
    //     });
    // }

    return {
        notify: notify
    };
}]);
