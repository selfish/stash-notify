/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * on 10/05/2016
 */

/* eslint no-use-before-define: 0*/
app.factory('schedule', ['ls', 'notifications', (ls, notifications) => {
    function _log(str) {
        console.log(`%c SC: ${str}`, 'background-color: #FFF9DB;');
    }

    // Set later to use local time:
    later.date.localTime();

    function _clearSchedule() {
        _log(`Notifications schedule cleared`);
        if (timer && _.isFunction(_.get(timer, 'clear'))) {
            timer.clear();
        }
    }

    function scheduleDataFetch(fetchFunction) {
        _log(`Data fetching was scheduled every 5 minutes`);
        var sched = later.parse.recur().every(5).minute();
        later.setInterval(fetchFunction, sched);
    }

    function schedNotifications(remindEvery) {
        _clearSchedule();

        _log(`Notifications scheduled every ${remindEvery} hours, next occurences:`);
        var sched = later.parse.recur().every(remindEvery).hour();

        var timer = later.setInterval(notifications.notify, sched);
        var next = later.schedule(sched).next(6);
        next.shift();
        next.forEach(o => {
            _log(o);
        });
        return timer;
    }

    var timer = schedNotifications(ls.get('remindEvery') || 2);

    return {
        updateSchedule: schedNotifications,
        scheduleDataFetch: scheduleDataFetch
    };
}]);
