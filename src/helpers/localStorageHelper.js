/**
 * Created by nitaip on 19/07/2015.
 */


var lsDefaults = {

    // Content:
    "_server": '',

    // Behaviour:
    "_scrum_master": false,
    "_notifyPRs": true,
    "_repeatUntilNoticed": "click",

    // Appearance:
    "_hide_popup_head": true,
    "_hide_bottom_bar": false,
    "_line_height": 7,
    "_multiline_popup": true,
    "_show_repo_icon": true,
    "_snooze_this_btn": false,
    "_snooze_all_btn": false,
    "_hide_pr_with_tasks": false,
    "_hide_section_title": false,
    "_hide_my_pr": false,
    "_highlight_mine_with_tasks": true,

    // Intervals:
    "_notifyInterval": 300000,
    "_refreshInterval": 120000,
    "_snooze_duration": 3600000,

    // Login settings:
    "_username": '',
    "_password": '',
    "_login": false
};

function initSettings(override) {
    var difference = _.xor(_.keys(localStorage), _.keys(lsDefaults));
    if (difference.length) {
        //console.warn("Mismatch in ls defaults: " + difference)
        var lsMissing = _.difference(_.keys(lsDefaults), _.keys(localStorage));
        var defaultMissing = _.filter(_.difference(_.keys(localStorage), _.keys(lsDefaults)), function (key) {
            return !_.contains(key, "http");
        });

        if (lsMissing.length) console.warn("Mismatch in ls defaults, localStorage missing: " + lsMissing);
        if (defaultMissing.length) console.warn("Mismatch in ls defaults, lsDefaults missing: " + defaultMissing);
    }

    _.each(lsDefaults, function (val, key) {
        if ((!localStorage[key]) || override) {
            localStorage[key] = val;
        }
    });
}