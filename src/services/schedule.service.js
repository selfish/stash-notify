app.factory('schedule', ['ls', ls => {
    let TIMER;

    function _log(str) {
        console.log(`%c SC: ${str}`, 'background-color: #FFF9DB;');
    }

    // Set later to use local time:
    later.date.localTime();

    function _clearSchedule() {
        _log(`Notifications schedule cleared`);
        if (TIMER && _.isFunction(_.get(TIMER, 'clear'))) {
            TIMER.clear();
        }
    }

    function scheduleDataFetch(fetchFunction) {
        _log(`Data fetching was scheduled every 5 minutes`);
        const sched = later.parse.recur().every(5).minute();
        later.setInterval(fetchFunction, sched);
    }

    function schedNotifications(fetchFunction, notifyFunction) {
        const remindEvery = ls.get('remindEvery') || 2;
        _clearSchedule();

        _log(`Notifications scheduled every ${remindEvery} hours, next occurences:`);
        const sched = later.parse.recur().every(remindEvery).hour();

        function updateNotify() {
            _log('Notification triggered');
            fetchFunction().then(notifyFunction);
        }

        const timer = later.setInterval(updateNotify, sched);
        const next = later.schedule(sched).next(6);
        next.shift();
        next.forEach(o => {
            _log(o);
        });
        TIMER = timer;
    }

    return {
        updateNotifySchedule: schedNotifications,
        scheduleDataFetch
    };
}]);
