/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * on 22/05/2016
 */

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

        var configObj = val ? mkObj() : key;
        set('config', (init === true) ? _.defaults(get('config'), configObj) : _.defaults(configObj, get('config')));
        return val;
    }

    // Returns a getter-setter function for a config value:
    function sgConfig(key) {
        return (val => {
            console.log(`SET-GET: ${key}\t${val}`);
            return val ? setConfig(key, val) : get('config')[key];
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
