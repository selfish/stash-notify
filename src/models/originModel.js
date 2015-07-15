/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * 02/07/2015.
 */

function updateServer(user, data) {
    var url = "http://52.27.57.154/presence/" + user + "/" + data;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "html",
        success: function (err, data) {
            console.log(err + " | " + data)
        }
    });
}