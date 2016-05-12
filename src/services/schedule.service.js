/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * on 10/05/2016
 */


app.factory('schedule', ['$localStorage', ($ls) => {

    function _log(str) {
        console.log(`%c SC: ${str}`, "background-color: #FFF9DB;");
    }

    // Set later to use local time:
    later.date.localTime();

    function _clearSchedule() {
        _log(`Notifications schedule cleared`);
        if (_.isFunction(_.get(timer, 'clear'))) timer.clear();
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

        timer = later.setInterval(notify, sched);
        var next = later.schedule(sched).next(6);
        next.shift();
        next.forEach((o) => {
            _log(o);
        });
        return timer;
    }

    function notify() {
        _log(`NOTIFY!`);

    }

    var timer = schedNotifications($ls.remindEvery || 2);

    return {
        notify: notify,
        updateSchedule: schedNotifications,
        scheduleDataFetch: scheduleDataFetch
    }


}]);