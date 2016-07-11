/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * on 23/05/2016
 */

app.controller('settings', ['$rootScope', '$scope', 'ls', ($rootScope, $scope, ls) => {
    $scope.validateInput = function (input) {
        return Boolean(input.type);
    };

    $scope.ls = ls;
    $scope.updateView = function () {
        $rootScope.$emit('updateView', {});
    };

    $scope.ops = {
        'Stash Server:': [
            {
                id: 'stashURL',
                type: 'textbox',
                text: 'Stash Server URL',
                placeholder: 'Stash URL'
            }
        ],
        'Pull Requests:': [{
            id: 'showPrWithTasks',
            type: 'checkbox',
            text: 'Show pull requests with open tasks'
        }, {
            id: 'scrumMaster',
            type: 'checkbox',
            text: 'Scrum Master Mode'
        }, {
            id: 'scrumMasterDescription',
            type: 'description',
            text: 'Scrum Master mode will only show PRs which were approved by at least one'
        }, {
            id: 'scrumMasterDescription2',
            type: 'description',
            text: 'more approver, making you the second reviewer for every pull reuqest.'
        }/* , {
         id: 'showApprovedPRs',
         type: 'checkbox',
         text: 'Show pull requests which were approved but not merged (always enabled in SM Mode)'
         }*/],
        'My Pull Requests:': [{
            id: 'showMine',
            type: 'checkbox',
            text: 'Show my own pull requests'
        }],
        'Notifications:': [{
            id: 'notifyNew',
            type: 'checkbox',
            text: 'Notify on new pull requests'
        }, {
            id: 'periodicReminder',
            type: 'checkbox',
            text: 'Remind me periodically on pending pull requests'
        }, {
            id: 'showSnooze',
            type: 'checkbox',
            text: 'Show snooze buttofn on notifications'
        }, {
            id: 'notifyInterval',
            type: 'select',
            text: 'Periodic reminder should appear every',
            options: [
                {val: 1, text: '1 Hour'},
                {val: 2, text: '2 Hours'},
                {val: 3, text: '3 Hours'},
                {val: 4, text: '4 Hours'},
                {val: 6, text: '6 Hours'},
                {val: 8, text: '8 Hours'},
                {val: 12, text: '12 Hours'},
                {val: 24, text: '24 Hours'},
                {val: 48, text: '48 Hours'}
            ]
        }, {
            id: 'snoozeDuration',
            type: 'select',
            text: 'Snooze should remain active for',
            options: [
                {val: 1, text: '1 Hour'},
                {val: 2, text: '2 Hours'},
                {val: 3, text: '3 Hours'},
                {val: 4, text: '4 Hours'},
                {val: 6, text: '6 Hours'},
                {val: 8, text: '8 Hours'},
                {val: 12, text: '12 Hours'},
                {val: 24, text: '24 Hours'},
                {val: 48, text: '48 Hours'}
            ]
        }]
    };
}]);
