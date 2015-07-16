
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-59789536-3']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

window.addEvent("domready", function () {
    // Option 1: Use the manifest:
    new FancySettings.initWithManifest(function (settings) {
        //settings.manifest.myButton.addEvent("action", function () {
        //    alert("You clicked me!");
        //});
    });
});
