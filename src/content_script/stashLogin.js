/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * 15/07/2015.
 */

chrome.runtime.sendMessage({login: true}, function (response) {
    document.getElementById("j_username").value = response.user;
    document.getElementById("j_password").value = response.pass;
    document.getElementById("submit").click();
});