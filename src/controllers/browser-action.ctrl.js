/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * on 09/05/2016
 */

var bg = chrome.extension.getBackgroundPage();

var app = angular.module('prApp', ['dcbImgFallback']);

app.config(['$compileProvider', $compileProvider => {
    // Allow URLS that angular considers unsafe:
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data|chrome-extension):/);
}]);

app.controller('prCtrl', ['$rootScope', '$scope', '$location', 'ls', 'util',
    ($rootScope, $scope, $location, ls, util) => {
        bg.GA.pageview('/browser_action');

        $scope.showOptions = false;
        $scope.showAbout = false;
        $scope.util = util;
        $scope.ls = ls;

        $scope.inboxZeroIcon = `../assets/signed/signed${_.random(6) + 1}.svg`;

        $scope.fullscreen = window.location.search.indexOf('full=true') > -1;

        $scope.bgFetch = () => {
            // ls.set('loading', true);
            bg.fetch()
                .then(() => {
                    ls.delete('loading');
                    $scope.$digest();
                });
        };

        $scope.showTasks = () => {
            var partURL = 'src/views/browser_action.html?full=true';
            var pageURL = chrome.extension.getURL(partURL);
            chrome.tabs.query({}, function (tabs) {
                var tabExists = tabs.some(tab => {
                    if (tab.url === pageURL) {
                        chrome.tabs.update(tab.id, {selected: true});
                        return true;
                    }
                    return false;
                });
                if (!tabExists) {
                    chrome.tabs.create({url: partURL});
                }
                window.close();
            });
        };

        function updateView() {
            $scope.prData = ls.get('prData');
            $scope.prDataMine = ls.get('prDataMine');
        }

        updateView();
        // crosstab.on('ls', updateView);
    }]);
