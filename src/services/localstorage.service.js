app.factory('ls', [() => {
    function get(key) {
        try {
            return JSON.parse(localStorage[key]);
        } catch (err) {
            return undefined;
        }
    }

    function set(key, val) {
        localStorage[key] = JSON.stringify(val);
        crosstab.broadcast('ls');
        return val;
    }

    function del(key) {
        delete localStorage[key];
        crosstab.broadcast('ls');
    }

    function setConfig(configObj) {
        set('config', _.defaults(get('config'), configObj));
    }

    function setConfigParam(key, val) {
        var configObj = {};
        configObj[key] = val;
        set('config', _.defaults(configObj, get('config')));
        return val;
    }

    // Returns a getter-setter function for a config value:
    function sgConfig(key) {
        return (val => {
            // console.log(`SET-GET: ${key}\t${val} -> ${val === undefined ? 'get' : 'set'}`);
            return val === undefined ? (_.get(get('config'), key) || '') : setConfigParam(key, val);
        });
    }

    return {
        get: get,
        set: set,
        delete: del,
        setConfig: setConfig,
        sgConfig: sgConfig
    };
}]);
