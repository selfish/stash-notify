/**
 * Created by nitaip on 27/07/2015.
 */

app.factory('gaService', ['ls', 'util', (ls, util) => {
    ga('create', 'UA-65738374-2', {userId: getUUID()});

    function _log(str) {
        console.log(`%c GA: ${str}`, 'background-color: #FFDBE1;');
    }

    function getUUID() {
        if (ls.get('uuid') === undefined) {
            ls.set('uuid', util.uuid());
        }
        return ls.get('uuid');
    }

    function gaHeartbeat() {
        event('Heartbeat', 'Heartbeat', '');
        setTimeout(gaHeartbeat, 29 * 60 * 1000); // 29 Minutes
    }

    gaHeartbeat();

    function pageview(page) {
        if (!page) {
            console.error(`Missing data for pageview: ${page}`);
            return;
        }
        _log(`Report Pageview: ${page}`);
        ga('send', 'pageview', page);
    }

    function event(eventCategory, eventAction, eventLabel) {
        if (!eventCategory || !eventAction) {
            console.error(`missing data for event: ${eventCategory}, ${eventAction}`);
            return;
        }
        _log(`Report Event: (${eventCategory}, ${eventAction}, ${eventLabel})`);
        ga('send', 'event', eventCategory, eventAction, eventLabel);
    }

    function setMeta(key, value) {
        if (!key || !value) {
            console.error(`missing data for set: {${key} : ${value}}`);
            return;
        }
        _log(`Set: (${key}=${value})`);
        ga('set', key, value);
    }

    ga('set', 'checkProtocolTask', null);
    setMeta('dimension1', getUUID());
    setMeta('dimension3', chrome.runtime.getManifest().version);

    if (util.host()) {
        // Noinspection JSUnresolvedFunction
        setMeta('dimension2', md5(util.host()));
    }

    return {
        pageview,
        event
    };
}]);
