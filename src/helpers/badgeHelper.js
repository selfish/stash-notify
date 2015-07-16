/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * 02/07/2015.
 */

function setBadge(text, title, color, nText) {
    if (text && text.toString()) chrome.browserAction.setBadgeText({text: text.toString()});
    if (title && title.toString()) chrome.browserAction.setTitle({title: title.toString()});
    if (color)chrome.browserAction.setBadgeBackgroundColor({color: color});
    if (nText) chrome.notifications.create(Date.now() + "", {
        type: "basic",
        iconUrl: "icon/clock.png",
        title: "Snel",
        eventTime: Date.now(),
        message: nText
    });
}

function clearBadge() {
    chrome.browserAction.setBadgeText({text: ""});
}

function errHandle(err) {
    setBadge("ERR", err, "#000000");
}

function loginErr(errText) {
    errHandle(errText || "Login error, check credentials and connection.");
}