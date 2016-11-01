/* eslint no-extend-native: ["error", { "exceptions": ["Promise"] }] */

app.factory('stash', ['ls', 'util', (ls, util) => {
    function _log(str) {
        console.log(`%c ST: ${str}`, 'background-color: #DCE2FF;');
    }

    const urls = {
        pullRequestsURL: '/rest/inbox/latest/pull-requests?role=reviewer&start=0&limit=10&avatarSize=64&state=OPEN&order=oldest',
        myPullRequestsURL: '/rest/inbox/latest/pull-requests?role=author&start=0&limit=10&avatarSize=64&state=OPEN&order=oldest'
    };

    function prFetch() {
        ls.set('loading', true);
        _log('Fetching PR Data');
        return util.get(urls.pullRequestsURL)
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

    function _getTasksByPR(pr, limit) {
        const stashRemote = util.stashRemoteFromUrl(pr.links.self[0].href);
        const url = [
            '/rest/api/1.0',
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
            '/rest/api/1.0',
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
