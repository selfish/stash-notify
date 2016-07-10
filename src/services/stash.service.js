/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * on 10/05/2016
 */

app.factory('stash', ['ls', 'util', (ls, util) => {
    function _log(str) {
        console.log(`%c ST: ${str}`, 'background-color: #DCE2FF;');
    }

    const urls = {
        pullRequestsURL: '/rest/inbox/latest/pull-requests?role=reviewer&start=0&limit=10&avatarSize=64&state=OPEN&order=oldest',
        myPullRequestsURL: '/rest/inbox/latest/pull-requests?role=author&start=0&limit=10&avatarSize=64&state=OPEN&order=oldest',
        whoAmI: '/plugins/servlet/applinks/whoami'
    };

    function prFetch() {
        ls.set('loading', true);
        _log('Fetching PR Data');
        return util.get(urls.pullRequestsURL)
            .then(_prPrepare)
            .then(_getTasks)
            .then(_getMergeStatus)
            .then(res => {
                ls.set('prData', res.values);
                _log('--- Success.');
                ls.set('error', false);
                return res.values.length;
            })
            .catch(err => {
                _log(`--- Failure: ${err}`);
                if (ls.get('prData') === undefined) {
                    ls.set('error', true);
                }
            }).finally(() => {
                _log('--- Load complete ---');
                ls.set('error', false);
            });
    }

    function prFetchMine() {
        ls.set('error', false);
        ls.set('loading', true);
        _log('Fetching MY PR Data');
        return util.get(urls.myPullRequestsURL)
            .then(_prPrepare)
            .then(_getTasks)
            .then(_getMergeStatus)
            .then(res => {
                ls.set('prDataMine', res.values);
                _log('--- Success.');
                ls.set('error', false);
                return res.values.length;
            })
            .catch(err => {
                _log(`--- Failure: ${err}`);
            }).finally(() => {
                _log('--- Load complete ---');
                ls.set('loading', false);
            });
    }

// previously filterResult
    function _prPrepare(data) {
        _log(`> Prepare data (${data.values.length} items)`);
        // Open tasks:
        if (ls.get('config').hidePrWithTasks) {
            data.values = data.values.filter(pr => {
                return _.get(pr, 'properties.openTaskCount') === 0;
            });
        }

        // Scrum master:
        if (ls.get('config').scrumMaster && _me()) {
            data.values = data.values.filter(pr => {
                // If I'm the only reviewer, display:
                if (pr.reviewers.length === 1) {
                    return true;
                }
                // Else, if at least one other had reviewed:
                return _.some(pr.reviewers, rev => {
                    return (rev.approved === true && rev.user.name !== _me());
                });
            });
        }

        data.size = data.values.length;
        // return data:
        return data;
    }

    function _me() {
        if (_.isUndefined(ls.get('me'))) {
            // Will return null, and skip the check.
            util.get(urls.whoAmI)
                .then(data => {
                    _log(`me fetched: '${ls.set('me', data)}'`);
                }).catch(_.noop);
        } else {
            return ls.get('me');
        }
    }

    function _getTasksByPR(pr, limit) {
        const stashRemote = util.stashRemoteFromUrl(pr.links.self[0].href);
        const url = [
            stashRemote.scheme, '://',
            stashRemote.host, '/rest/api/1.0',
            '/projects/', stashRemote.project,
            '/repos/', stashRemote.repo,
            '/pull-requests/', stashRemote.pr,
            '/tasks?start=0&limit=', limit || 5
        ].join('');

        return util.get(url).then(taskData => {
            return taskData.values.map(t => {
                return {text: t.text, author: t.author.displayName, state: t.state, created: t.createdDate};
            });
        });
    }

    function _getTasks(data) {
        _log(`> Getting tasks data: (${data.values.length} items)`);
        return Promise.map(data.values, pr => {
            return _getTasksByPR(pr)
                .then(tasks => {
                    pr.tasks = tasks;
                    return pr;
                });
        })
            .then(res => {
                data.values = res;
                return data;
            });
    }

    function _getMergeStatusByPR(pr) {
        const stashRemote = util.stashRemoteFromUrl(pr.links.self[0].href);
        const url = [
            ls.get('config').stashURL, '/rest/api/1.0',
            '/projects/', stashRemote.project,
            '/repos/', stashRemote.repo,
            '/pull-requests/', stashRemote.pr,
            '/merge'
        ].join('');
        return util.get(url).then(res => {
            if (res.conflicted === true) {
                res.vetoes.push({
                    detailedMessage: 'This pull reuqest has a conflic, and cannot be automatically merged.',
                    summaryMessage: 'Has Conficts'
                });
            }
            return res;
        });
    }

    function _getMergeStatus(data) {
        _log(`> Getting Merge Status: (${data.values.length} items)`);
        return Promise.map(data.values, pr => {
            return _getMergeStatusByPR(pr)
                .then(mergeStatus => {
                    pr.mergeStatus = mergeStatus;
                    return pr;
                });
        })
            .then(res => {
                data.values = res;
                return data;
            });
    }

    return {
        prFetch: prFetch,
        prFetchMine: prFetchMine
    };
}]);
