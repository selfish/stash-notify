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
                host: localStorage["store.settings.server"],
                hideHead: localStorage["store.settings.hide_popup_head"] == 'true',
                multiline: localStorage["store.settings.multiline_popup"] == 'true'
            });
        }
        if (request.login) {
            sendResponse({
                user: localStorage["store.settings.username"],
                pass: localStorage["store.settings.password"]
            });
        }
    });