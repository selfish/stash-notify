const bg = chrome.extension.getBackgroundPage();

const app = angular.module('prApp', ['dcbImgFallback']);

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
            // Ls.set('loading', true);
            bg.fetch()
                .then(() => {
                    ls.delete('loading');
                    $scope.$digest();
                    $rootScope.$emit('updateView', {});
                });
        };

        $scope.showTasks = () => {
            const partURL = 'src/views/browser_action.html?full=true';
            const pageURL = chrome.extension.getURL(partURL);
            chrome.tabs.query({}, tabs => {
                const tabExists = tabs.some(tab => {
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
            const prData = ls.get('prData');
            $scope.prData = (_.isArray(prData) ? prData : []).filter(pr => {
                // Scrum master mode:

                const hasApproval = _.some(pr.reviewers, rev => {
                    return (rev.approved === true);
                });
                const hasOtherApproval = _.some(pr.reviewers, rev => {
                    return (rev.approved === true && rev.user.name !== util.me());
                });
                const hasMultipleReviewers = pr.reviewers.length > 1;

                if (ls.get('config').scrumMaster) {
                    if (util.me() && hasMultipleReviewers && !hasOtherApproval) {
                        return false;
                    }
                    // Show pull requests which were approved but not merged,
                    // else if becuase if used with Scrum Master mode, will never show anything:
                } else if (hasApproval && !ls.get('config').showApprovedPRs) {
                    return false;
                }

                // Open tasks:
                if (_.get(pr, 'properties.openTaskCount') > 0 && !ls.get('config').showPrWithTasks) {
                    return false;
                }

                return true;
            });
            $scope.prDataMine = ls.get('prDataMine');
        }

        $rootScope.$on('updateView', updateView);
        updateView();
        // Crosstab.on('ls', updateView);
    }]);
