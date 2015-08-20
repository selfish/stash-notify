/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * 15/07/2015.
 */

var bg = chrome.extension.getBackgroundPage();

function mk() {

    Promise.all([
        bg.mkDIV(JSON.parse(localStorage.prData), 'inbox-pull-request-reviewer', "Pending Review"),
        bg.mkDIV(JSON.parse(localStorage.prDataMine), 'inbox-pull-request-author', "My Pull Requests")
    ])
        .spread(function (div, myDiv) {

            var host = bg.host();
            var hideHead = bg.localStorage["_hide_popup_head"] == 'true';
            var multiline = bg.localStorage["_multiline_popup"] == 'true';
            var show_repo_icon = bg.localStorage["_show_repo_icon"] == 'true';
            var line_height = bg.Number(localStorage["_line_height"].replace(/"/g, ''));

            var body = $('body');

            // Add base for relative URLs:
            var bt = document.createElement("base");
            bt.setAttribute("href", host);
            document.getElementsByTagName("head")[0].appendChild(bt);

            // Add css:
            var cssHref = chrome.extension.getURL("/src/browser_action/browser_action.css");
            var cssLink = $("<link rel='stylesheet' type='text/css' href='" + cssHref + "'>");
            $("head").append(cssLink);

            // Fill in content:
            //$('body').prepend($(localStorage.div || '<div style="padding: 20px;">Loading...</div>'));
            $('#inbox-pull-request-reviewer').remove();
            $('#inbox-pull-request-author').remove();
            if (localStorage["_hide_my_pr"] != "true") {
                body.prepend($(myDiv));
            }
            body.prepend($(div));

            var remove = ['.spinner', '.secondary-link'];

            if (!show_repo_icon) remove.push('.aui-avatar-project');
            if (hideHead) remove.push("thead");
            if (!multiline) remove.push('.source', '.destination',
                '.pull-request-list-task-count-column-value', '.pull-request-list-task-count-column');

            remove.forEach(function (selector) {
                $(selector).each(function () {
                    this.remove()
                })
            });

            $('a').filter(function () {
                return !$(this).attr('target');
            }).attr('target', '_blank');
            $('td').css('padding-top', line_height).css('padding-bottom', line_height);
            $('th.author').html("By");

            if (localStorage["_highlight_mine_with_tasks"] == 'true') {
                $('#inbox-pull-request-author').find('td.pull-request-list-task-count-column-value').each(function (i, td) {
                    td = $(td);
                    if (Number(td.attr('redify'))) {
                        td.parent().css('background', '#FDF4D4');
                    }
                });
            }

            if (multiline) {
                // Break rows:

                $('tr').each(function () {
                    var newTR = $('<tr>');
                    $.each(this.attributes, function () {
                        newTR.attr(this.name, this.value);
                    });

                    var oldTR = this;
                    [6, 6, 6].forEach(function (i) {
                        newTR.insertAfter(oldTR).append($('th:eq(' + i + '), td:eq(' + i + ')', oldTR));
                    })
                });
                //$('.title').attr('colspan',2);
                $('.source').attr('colspan', 2);
                $('.destination').attr('colspan', 2);
                $('.updated').attr('colspan', 2);
            }

            if (localStorage["_hide_bottom_bar"] == "true") {
                $('.bottom_bar').remove();
            }


            var maxWidth = Math.max.apply(Math, $('td.reviewers').map(function () {
                return $(this).width();
            }).get());

            var startTD = $($('td.reviewers').filter(function () {
                return $(this).width() == maxWidth;
            })[0]);

            // Align TDs:
            startTD.parent().children().each(function (ielem, elem) {
                elem = $(elem);
                if (elem.is('td')) {
                    $('td.' + elem.attr('class')).each(function (itarget, target) {
                        $(target).width(elem.width());
                        $(target).css('min-width', elem.width());
                        $(target).css('max-width', elem.width());
                    });
                }
            });

            // Reset page height:
            $('html').height(body.height());
            bg.ga('send', 'pageview', '/popup');

            $('.showTasks').each(function (i, elem) {
                elem.onclick = function () {
                    showTasks(elem.attributes['stashLink'].value);
                }
            })
        });
}

$('body').ready(mk);

chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.loaded) mk();
    });
// OnClose:
window.addEventListener("beforeunload", function (e) {
    bg.go(true, false);
}, false);

function showTasks(url) {
    chrome.tabs.create({
        url: url
    }, function (tab) {
        chrome.tabs.executeScript(tab.id, {
            runAt: 'document_end',
            code: "localStorage.popo = Date.now()"//"alert('go!')"//"document.getElementsByClassName('task-list-dialog-link')[0].click()"
        });
    });
}