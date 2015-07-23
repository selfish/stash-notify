/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * 14/07/2015.
 */

function najax(uri) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: uri,
            type: "GET",
            dataType: "html",
            error: function (jqXHR, textStatus, errorThrown) {
                reject(errorThrown);
            },
            success: function (data) {
                resolve(data);
            }
        });
    });
}