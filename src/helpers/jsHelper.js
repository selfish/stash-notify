/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * 14/07/2015.
 */

function najax(uri, cb) {
    $.ajax({
        url: uri,
        type: "GET",
        dataType: "html",
        error: cb,
        success: function (data) {
            var res;
            try {
                res = JSON.parse(data);
            } catch (e) {
                res = data;
            }
            cb(null, res);
        }
    });
}