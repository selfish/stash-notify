/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * 15/07/2015.
 */

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.div) {
            localStorage.div = request.div;
            console.log("Got div.");
            sendResponse({ok: true});
            chrome.tabs.remove(sender.tab.id);
        }
        if (request.getPRdiv) {
            sendResponse({
                div: mkDIV(JSON.parse(localStorage.prData), 'inbox-pull-request-reviewer', "Pending Review"),
                myDiv: mkDIV(JSON.parse(localStorage.prDataMine), 'inbox-pull-request-author', "My Pull Requests"),
                host: host(),
                hideHead: localStorage["_hide_popup_head"] == 'true',
                multiline: localStorage["_multiline_popup"] == 'true',
                show_repo_icon: localStorage["_show_repo_icon"] == 'true',
                line_height: Number(localStorage["_line_height"].replace(/"/g, ''))
            });
        }
        if (request.login) {
            sendResponse({
                user: localStorage["_username"],
                pass: localStorage["_password"]
            });
        }
        if (request.go) {
            go(true, false);
        }
    });