/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * on 09/05/2016
 */

var bg = chrome.extension.getBackgroundPage();

var app = angular.module('prApp', ['ngStorage', 'dcbImgFallback']);

app.config(['$compileProvider', ($compileProvider) => {
    // Allow URLS that angular considers unsafe:
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data|chrome-extension):/);
}]);

app.controller('prCtrl', ['$scope', '$localStorage', 'util',
    ($scope, $localStorage, util) => {

        bg.GA.pageview('/browser_action');

        window.$ls = $scope.$ls = bg.$ls;//$localStorage;
        $scope.$ls.stashURL = 'https://stash.ironsrc.com';
        $scope.showOptions = false;
        $scope.util = util;

        $scope.bgFetch = ()=> {
            bg.fetch();
        };

    }]);