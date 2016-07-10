// Check whether new version is installed


var app = angular.module('bgApp', []);

var fetch = Promise.resolve();
var GA;

app.controller('bgCtrl', ['$scope', 'util', 'stash', 'schedule', 'gaService', 'ls', 'badge',
    ($scope, util, stash, schedule, gaService, ls, badge) => {

        function _log(str) {
            console.log(`%c BG: ${str}`, "background-color: #F2F2F2;");
        }

        window.ls = ls;

        GA = gaService;
        GA.pageview('/background');

        initSettings();

        fetch = () => {
            return stash.prFetch().then((prSize)=> {
                stash.prFetchMine().then((prMineSize)=> {
                    if (prSize + prMineSize > 0) {
                        badge.set(`${prSize}/${prMineSize}`);
                    } else {
                        badge.clear();
                    }
                });
            });
        };
        fetch();

        schedule.scheduleDataFetch(fetch);

        function initSettings() {

            // TODO:
            ls.setConfig({
                hide_pr_with_tasks: false,
                scrum_master: false
            }, null, true);

            _log("Settings initialized");
        }

        //noinspection JSCheckFunctionSignatures
        chrome.runtime.onInstalled.addListener((details) => {
            const version = chrome.runtime.getManifest().version;
            if (details.reason == "install") {
                _log("First install");
                GA.event('install', 'install', version);
            } else if (details.reason == "update") {
                _log(`Updated from ${details.previousVersion} to ${version}`);
                GA.event('install', 'update', `${details.previousVersion} -> ${version}`);
            }
        });
    }]);
