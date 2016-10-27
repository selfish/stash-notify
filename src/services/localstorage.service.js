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

    function setConfig(key, val, init) {
        function mkObj() {
            var o = {};
            o[key] = val;
            return o;
        }

        var configObj = (val === undefined ? key : mkObj());
        set('config', (init === true) ? _.defaults(get('config'), configObj) : _.defaults(configObj, get('config')));
        return val;
    }

    // Returns a getter-setter function for a config value:
    function sgConfig(key) {
        return (val => {
            // console.log(`SET-GET: ${key}\t${val} -> ${val === undefined ? 'get' : 'set'}`);
            return val === undefined ? get('config')[key] : setConfig(key, val);
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
