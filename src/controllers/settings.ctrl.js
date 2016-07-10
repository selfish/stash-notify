/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * on 23/05/2016
 */

app.controller('settings', ['$scope', $scope => {
    $scope.validateInput = function (input) {
        return Boolean(input.type);
    };

    $scope.ops = {
        'Details': [
            {
                id: 'stashURL',
                type: 'textbox',
                text: 'Stash Server URL',
                placeholder: 'Stash URL'
            }
        ],
        'Pull Requests': [{
            id: 'scrumMaster',
            type: 'checkbox',
            text: 'Scrum Master Mode'
        },{
            id: 'showApprovedPRs',
            type: 'checkbox',
            text: 'Show PRs approved but not merged'
        }, {
            id: 'hidePrWithTasks',
            type: 'checkbox',
            text: 'Hide pull requests with open tasks'
        }],
        'My Pull Requests': [{
            id: 'hide_my_pr',
            type: 'checkbox',
            text: 'Hide my own pull requests'
        }, {
            id: 'highlight_mine_with_tasks',
            type: 'checkbox',
            text: 'Highlight my pull requests having open tasks'
        }],
        'Notifications': [{
            id: 'hide_my_pr',
            type: 'Notify on new pull requests',
            text: 'Hide my own pull requests'
        }, {
            id: 'hide_my_pr',
            type: 'checkbox',
            text: 'Hide my own pull requests'
        }, {
            id: 'hide_my_pr',
            type: 'checkbox',
            text: 'Hide my own pull requests'
        }, {
            id: 'repeatUntilNoticed',
            type: 'select',
            text: 'Notify until',
            options: [
                {val: 'once', text: 'Shown once'},
                {val: 'click', text: 'Clicked'},
                {val: 'always', text: 'As long as active'}
            ]
        }, {
            id: 'notifyInterval',
            type: 'select',
            text: 'Hide my own pull requests',
            options: [
                {val: 1, text: '1 Hour'},
                {val: 2, text: '2 Hours'},
                {val: 3, text: '3 Hours'},
                {val: 4, text: '4 Hours'},
                {val: 6, text: '6 Hours'},
                {val: 8, text: '8 Hours'},
                {val: 12, text: '12 Hours'}
            ]
        }, {
            id: 'snooze_duration',
            type: 'select',
            text: 'Snooze duration',
            options: [
                {val: 2, text: '2 Hours'},
                {val: 3, text: '3 Hours'},
                {val: 4, text: '4 Hours'},
                {val: 6, text: '6 Hours'},
                {val: 8, text: '8 Hours'},
                {val: 12, text: '12 Hours'},
                {val: 24, text: '24 Hours'},
                {val: 48, text: '48 Hours'}
            ]
        }],
        'Appearance': [{
            id: 'staffshURL',
            text: 'Stash Server URL',
            getter: 'stashURL',
            placeholder: 'Stash URL'
        }]
    };
}]);
