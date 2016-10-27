app.factory('util', ['ls', '$http', (ls, $http) => {
    function _log(str) {
        console.log(`%c UT: ${str}`, 'background-color: #E8DDBD;');
    }

    function uuid() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, a => ((a ^ Math.random()) * 16 >> a / 4).toString(16));
    }

    function seedColor(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var c = (hash & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();

        return '00000'.substring(0, 6 - c.length) + c;
    }

    function host(uri) {
        if (!uri) {
            return ls.get('config').stashURL;
        }
        if (uri.indexOf('http') === 0) {
            return uri;
        }

        var splitRegExp = /\/(\b|$)/g;
        return (_.compact(host().split(splitRegExp).concat(uri.split(splitRegExp)))).join('/');
    }

    function getAvatar(user) {
        // return host(user.avatarUrl.split("?")[0]);
        return host(user.avatarUrl);
    }

    function timeAgo(date) {
        return moment(date).fromNow();
    }

    function vetoTooltip(pr) {
        var blockers = pr.mergeStatus.vetoes.length === 1 ? 'Blocker for merge' : 'Blockers for merge';
        var colon = pr.mergeStatus.vetoes.length === 0 ? '' : ':';
        return [(pr.mergeStatus.vetoes.length || 'No') + ' ' + blockers + colon]
            .concat(pr.mergeStatus.vetoes.map(veto => {
                return '- ' + veto.summaryMessage;
            }))
            .join('\n');
    }

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, txt => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    function _breakCamelCase(str) {
        return str.replace(/([A-Z])/g, ' $1').trim();
    }

    function commentTooltip(pr) {
        return Object.keys(pr.properties).map(prop => {
            return toTitleCase(_breakCamelCase(prop)) + ': ' + pr.properties[prop];
        }).join('\n');
    }

    function get(uri, cb) {
        ls.set('error', false);
        ls.delete('errorMsg');

        if (!_.isFunction(cb)) {
            cb = _.noop;
        }

        uri = host(uri);

        _log(`Fetch URL : ${uri}`);
        return new Promise((resolve, reject) => {
            $http({
                method: 'GET',
                url: uri
            }).then(function success(res) {
                resolve(res.data);
                cb(null, res.data);
            }, function error(res) {
                ls.error = true;
                ls.errorMsg = res.status + ': ' + res.statusText;
                cb(new Error(res.status));
                reject(res.status);
            });
        });
    }

    const identity = (v => v);

    // Regex parts:  scheme  junk           host      path      query
    const regex = /^(https?)(?::\/\/)?(\/?[^\/]+)(\/?.+?)(?:\?(.+))?$/;

    function splitUrl(url) {
        // Split url into parts:
        var [scheme, host, path, query] = url.match(regex).slice(1);

        // Path to array:
        path = (path ? path : []).split('/').map(decodeURIComponent).filter(identity);

        // Query to object
        query = (query ? query.split('&') : []).reduce((result, pair) => {
            var [name, value] = pair.split('=');
            result[decodeURIComponent(name)] = decodeURIComponent(value);
            return result;
        }, {});

        return {scheme, host, path, query};
    }

    function stashRemoteFromUrl(url) {
        const {scheme, host, path} = splitUrl(url);
        const result = {scheme, host};
        const setResult = (key, arr, idx) => {
            if (path[idx + 1]) {
                result[key] = path[idx + 1];
            }
        };
        if (path.length) {
            path.forEach((node, idx, arr) => {
                switch (node) {
                    case 'projects':
                        setResult('project', arr, idx);
                        break;
                    case 'repos':
                        setResult('repo', arr, idx);
                        break;
                    case 'pull-requests':
                        setResult('pr', arr, idx);
                        break;
                    case 'tasks':
                        setResult('task', arr, idx);
                        break;
                    default:
                        break;
                }
            });
        }
        return result;
    }

    function me() {
        if (_.isUndefined(ls.get('me'))) {
            // Will return null, and skip the check.
            get('/plugins/servlet/applinks/whoami')
                .then(data => {
                    _log(`me fetched: '${ls.set('me', data)}'`);
                }).catch(_.noop);
        } else {
            return ls.get('me');
        }
    }

    return {
        seedColor: seedColor,
        host: host,
        getAvatar: getAvatar,
        toTitleCase: toTitleCase,
        timeAgo: timeAgo,
        vetoTooltip: vetoTooltip,
        commentTooltip: commentTooltip,
        get: get,
        splitUrl: splitUrl,
        stashRemoteFromUrl: stashRemoteFromUrl,
        uuid: uuid,
        me: me
    };
}]);
