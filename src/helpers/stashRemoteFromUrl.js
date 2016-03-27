{
    const stashRemoteFromUrl = infect.func(function(url, splitUrl) {
        const {scheme, host, path} = splitUrl(url);
        const result = {scheme, host};
        const setResult = (key, arr, idx) => {
            if (path[idx+1]) {
                result[key] = path[idx+1];
            }
        }
        if (path.length) {
            let i;

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
    }, this);
    stashRemoteFromUrl.$infect = ['splitUrl'];
    infect.set('stashRemoteFromUrl', stashRemoteFromUrl);
}
