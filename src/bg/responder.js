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
                host: localStorage["settings.server"],
                hideHead: localStorage["store.settings.hide_popup_head"] == 'true',
                multiline: localStorage["store.settings.multiline_popup"] == 'true',
                show_repo_icon: localStorage["store.settings.show_repo_icon"] == 'true',
                line_height: Number(localStorage["store.settings.line_height"].replace(/"/g, ''))
            });
        }
        if (request.login) {
            sendResponse({
                user: localStorage["store.settings.username"],
                pass: localStorage["store.settings.password"]
            });
        }
        if (request.go) {
            go(true, false);
        }
    });