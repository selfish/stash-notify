


function dismissAllNotifications(){
    chrome.notifications.getAll(function(notifications){
        Object.keys(notifications).forEach(function (id) {
            chrome.notifications.clear(id);
        })
    })
}
