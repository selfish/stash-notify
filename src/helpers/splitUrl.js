{
    /** Identity function */
    const identity = (v) => v

    // Regex parts:  scheme  junk           host      path      query
    const regex = /^(https?)(?:\:\/\/)?(\/?[^\/]+)(\/?.+?)(?:\?(.+))?$/;

    const splitUrl = (url) => {
        /** Split url into parts */
        var [scheme, host, path, query] = url.match(regex).slice(1);

        /** Path to array */
        path = !path ? [] : path.split('/').map(decodeURIComponent).filter(identity);

        /** Query to object */
        query = !query ? [] : query.split('&').reduce((result, pair) => {
            var [name, value] = pair.split('=');
            result[decodeURIComponent(name)] = decodeURIComponent(value);
            return result
        }, {});

        return { scheme, host, path, query };
    }

    infect.set('splitUrl', splitUrl);
}
