/**
 * Created by nitaip on 27/07/2015.
 */

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-59789536-3']);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

function hashCode(str) {
    var hash = 0, i, chr, len;
    if (str.length == 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getUUID() {
    if (!localStorage['_uid'] || !localStorage['_uid'].length) {
        localStorage['_uid'] = uuid();
    }
    return localStorage['_uid'];
}

ga('set', 'uid', getUUID());
ga('set', 'version', chrome.runtime.getManifest().version);

if (host()) {
    ga('set', 'organization', hashCode(host()));
}