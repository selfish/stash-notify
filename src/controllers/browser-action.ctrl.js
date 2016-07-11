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
                    $rootScope.$emit('updateView', {});
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
            debugger;
            $scope.prData = ls.get('prData').filter(pr => {
                // Scrum master mode:
                if (ls.get('config').scrumMaster) {
                    if (util.me()) {
                        var hasMultipleReviewers = pr.reviewers.length > 1;
                        var hasApproval = _.some(pr.reviewers, rev => {
                            return (rev.approved === true && rev.user.name !== util.me());
                        });

                        if (hasMultipleReviewers && !hasApproval) {
                            return false;
                        }
                    }
                    // Show pull requests which were approved but not merged,
                    // else if becuase if used with Scrum Master mode, will never show anything:
                } else if (!ls.get('config').showApprovedPRs) {
                    var hasApproval = _.some(pr.reviewers, rev => {
                        return (rev.approved === true);
                    });
                    debugger;
                    if (hasApproval) {
                        return false;
                    }
                }

                // TODO: Open tasks:
                // if (ls.get('config').hidePrWithTasks) {
                //     data.values = data.values.filter(pr => {
                //         return _.get(pr, 'properties.openTaskCount') === 0;
                //     });
                // }

                return true;
            });
            $scope.prDataMine = ls.get('prDataMine');
        }

        $rootScope.$on('updateView', updateView);
        updateView();
        // crosstab.on('ls', updateView);
    }]);
