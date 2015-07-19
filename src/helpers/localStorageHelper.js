/**
 * Created by nitaip on 19/07/2015.
 */


var lsDefaults = {

    // Content:
    "div": "",
    "settings.server": "",
    "store.settings.server": "\"\"",

    // Behaviour:
    "store.settings.scrum_master": "false",
    "store.settings.notify": "true",
    "store.settings.repeatUntilNoticed": "\"click\"",

    // Appearance:
    "store.settings.hide_popup_head": "false",
    "store.settings.hide_bottom_bar": "false",
    "store.settings.line_height": "\"7\"",
    "store.settings.multiline_popup": "true",
    "store.settings.show_repo_icon": "true",
    "store.settings.snooze_this_btn": "false",
    "store.settings.snooze_all_btn": "false",

    // Intervals:
    "store.settings.notifyInterval": "\"300000\"",
    "store.settings.refreshInterval": "\"120000\"",
    "store.settings.snooze_duration": "\"3600000\"",

    // Login settings:
    "store.settings.username": "\"\"",
    "store.settings.password": "\"\"",
    "store.settings.login": "false"
};

function initSettings(override) {
    localStorage = override ? _.assign(localStorage, lsDefaults) : _.merge(localStorage, lsDefaults)
}