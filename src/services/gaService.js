/**
 * Created by nitaip on 27/07/2015.
 */
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

// @formatter:off
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
// @formatter:on

ga('create', 'UA-65738374-2', {userId: getUUID()});

ga('set', 'checkProtocolTask', null);
ga('set', 'dimension1', getUUID());
ga('set', 'dimension3', chrome.runtime.getManifest().version);

if (host()) {
    ga('set', 'dimension2', md5(host()));
}
