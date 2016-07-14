// Check whether new version is installed

var app = angular.module('bgApp', []);

var fetch = Promise.resolve();
var GA;

app.controller('bgCtrl', ['$scope', 'util', 'stash', 'schedule', 'gaService', 'ls', 'badge', 'notifications',
    ($scope, util, stash, schedule, gaService, ls, badge, notifications) => {
        function _log(str) {
            console.log(`%c BG: ${str}`, 'background-color: #F2F2F2;');
        }

        // Fetch my name:
        util.me();

        window.ls = ls;

        GA = gaService;
        GA.pageview('/background');

        initSettings();

        fetch = () => {
            return stash.prFetch().then(prSize => {
                stash.prFetchMine().then(prMineSize => {
                    if (prSize + prMineSize > 0) {
                        badge.set(`${prSize}/${prMineSize}`);
                    } else {
                        badge.clear();
                    }
                });
            });
        };
        fetch();

        schedule.updateNotifySchedule(fetch, notifications.notify);
        schedule.scheduleDataFetch(fetch);

        function initSettings() {
            ls.setConfig({
                // Pull Requests:
                scrumMaster: false,
                showApprovedPRs: true,
                showPrWithTasks: true,
                // My Pull Requests:
                showMine: true,
                // Notifications
                notifyNew: true,
                periodicReminder: true,
                showSnooze: true,
                notifyInterval: '1',
                snoozeDuration: '2'
            }, null, true);

            _log('Settings initialized');
        }

        // noinspection JSCheckFunctionSignatures
        chrome.runtime.onInstalled.addListener(details => {
            const version = chrome.runtime.getManifest().version;
            if (details.reason === 'install') {
                _log('First install');
                GA.event('install', 'install', version);
            } else if (details.reason === 'update') {
                _log(`Updated from ${details.previousVersion} to ${version}`);
                GA.event('install', 'update', `${details.previousVersion} -> ${version}`);
            }
        });
    }]);

