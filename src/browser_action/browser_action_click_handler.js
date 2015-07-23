/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * 16/07/2015.
 */

document.addEventListener('DOMContentLoaded', function () {

    var clickMap = [
        {
            select: 'stash',
            action: function () {
                chrome.tabs.create({
                    url: localStorage["settings.server"]
                });
            }
        },
        {
            select: 'refresh',
            action: function () {
                chrome.runtime.sendMessage({go: true});
            }
        },
        {
            select: 'snooze',
            action: function () {
                localStorage['snooze_all'] = Date.now() + Number(localStorage["_snooze_duration"].replace(/"/g, ''));
            }
        },
        {
            select: 'options',
            action: function () {
                chrome.tabs.create({
                    url: "/src/options_custom/index.html"
                });
            }
        }
    ];

    clickMap.forEach(function (btn) {
        if (document.getElementById(btn.select)) {
            document.getElementById(btn.select).addEventListener('click', btn.action);
        }
    });
});
