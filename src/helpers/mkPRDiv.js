/**
 * Created by nitaip on 19/07/2015.
 */


function inboxZero(){
    return $('<div>' +
        '<div id="inbox-pull-request-reviewer" class="tabs-pane active-pane" aria-hidden="false">' +
        '<table class="aui paged-table pull-requests-table no-rows" id="inbox-pull-request-table-reviewer" data-last-updated="1438589113976">' +
        '<thead>' +
        '<tr>' +
        '<th class="repository" scope="col">Repository</th>' +
        '<th class="title" scope="col">Title</th><th class="author" scope="col">Author</th>' +
        '<th class="reviewers" scope="col">Reviewers</th><th class="comment-count" scope="col"></th>' +
        '<th class="pull-request-list-task-count-column" title="" scope="col"></th><th class="source" scope="col">Source</th>' +
        '<th class="destination" scope="col">Destination</th><th class="updated" scope="col">Updated</th>' +
        '</tr>' +
        '</thead><tbody></tbody></table>' +
        '<div class="paged-table-message pull-request-table-message">' +
        '<span class="aui-icon aui-icon-large aui-iconfont-workbox-empty">No pull requests to approve</span>' +
        '<h3>Inbox Zero</h3></div><div class="spinner" style="display: none;"></div></div><div>');
}


function mkTD(pr, tdType) {
    switch (tdType) {
        case 'repository':
            return $(
                '<td class="repository">' +
                '<span class="aui-avatar aui-avatar-small aui-avatar-project">' +
                '<span class="aui-avatar-inner">' +
                '<img src="' + host(pr['fromRef']['repository']['project']['avatarUrl']) + '" alt="' + pr['fromRef']['repository']['project']['name'] + '">' +
                '</span>' +
                '</span>' +
                '<span title="apkMetadata"><a href="' + host(pr['fromRef']['repository']['link']['url']) + '">' + pr['fromRef']['repository']['name'] + '</a></span>' +
                '</td>'
            );
        case 'title':
            return $(
                '<td class="title">' +
                '<a title="' + pr['title'] + '" href="' + pr['link']['url'] + '">' + pr['title'] + '</a>' +
                '</td>');
        case 'author':
            return $(
                '<td class="author">' +
                '<div class="avatar-with-name" title="' + pr['author']['user']['displayName'] + '">' +
                '<span class="aui-avatar aui-avatar-small user-avatar" data-username="' + pr['author']['user']['name'] + '">' +
                '<span class="aui-avatar-inner"><img src="' + host(pr['author']['user']['avatarUrl']) + '" alt="' + pr['author']['user']['displayName'] + '"></span>' +
                '</span>' +
                '<a href="' + host(pr['author']['user']['link']['url']) + '" class="secondary-link">' + pr['author']['user']['displayName'] + '</a>' +
                '</div>' +
                '</td>');
        case 'reviewers':
            var td = $('<td class="reviewers"></td>');
            var revs = _.sortBy(pr['reviewers'],
                function (rev) {
                    return -1 * (rev.user.id);
                });
            revs.forEach(function (rev) {
                td.append($(
                    '<span class="aui-avatar aui-avatar-small aui-avatar-badged user-avatar ' +
                    (rev['approved'] ? '' : 'badge-hidden') + ' avatar-dimmed avatar-tooltip participant-item" data-username="' + rev['user']['name'] + '">' +
                    '<span class="aui-avatar-inner">' +
                    '<img src="' + host(rev['user']['avatarUrl']) + '" alt="' + rev['user']['displayName'] + '" original-title="' + rev['user']['displayName'] + '">' +
                    '</span>' +
                    '<span class="badge approved">?</span>' +
                    '</span>'
                ));
            });
            return td;

        case 'comment-count':
            var comments = pr['attributes']['commentCount'] || 0;
            var td_comm = $('<td class="comment-count"></td>');
            if (Number(comments)) {
                td_comm.append($(
                    '<span class="comment-count" title="' + comments + ' comments">' +
                    '<span class="aui-icon aui-icon-small aui-iconfont-comment">' + comments + ' comments</span>' + comments + '' +
                    '</span>'
                ));
            }
            return td_comm;

        case 'task-count':
        var tasks = Number(pr['attributes']['openTaskCount'] || 0);
        var resolvedTasks = Number(pr['attributes']['resolvedTaskCount'] || 0);
        var totTasks = tasks + resolvedTasks;
        var td_tasks = $('<td class="pull-request-list-task-count-column-value" redify="' + tasks + '"></td>');
        if (Number(totTasks)) {
            td_tasks.append($(
                '<span class="replacement-placeholder" data-pull-request-id="' + pr['id'] + '" data-repository-id="' + pr['fromRef']['repository']['id'] + '" style="display: inline;">' +
                '<span class="pr-list-open-task-count" title="' + tasks + ' open tasks">' +
                '<span class="aui-icon aui-icon-small aui-iconfont-editor-task" data-pull-request-id="' + pr['id'] + '">Resolved/Total tasks:</span>' +
                '<span class="task-count">' + resolvedTasks + ' / ' + totTasks + '<span></span></span></span></span>'
            ));
        }
        return td_tasks;
        case 'source':
            return $('<td class="source"><span class="aui-lozenge ref-lozenge monospace-lozenge" data-ref-tooltip="' + pr['fromRef']['displayId'] + '">' +
                '<span class="ref branch">' +
                '<span class="aui-icon aui-icon-small aui-iconfont-devtools-branch-small"></span>' +
                '<span class="name" aria-label="branch ' + pr['fromRef']['displayId'] + '">' + pr['fromRef']['displayId'] + '</span>' +
                '</span>' +
                '</span>' +
                '</td>');

        case 'destination':
            return $(
                '<td class="destination">' +
                '<span class="aui-lozenge ref-lozenge monospace-lozenge" data-ref-tooltip="' + pr['toRef']['displayId'] + '">' +
                '<span class="ref branch"><span class="aui-icon aui-icon-small aui-iconfont-devtools-branch-small"></span>' +
                '<span class="name" aria-label="branch ' + pr['toRef']['displayId'] + '">' + pr['toRef']['displayId'] + '</span>' +
                '</span>' +
                '</span>' +
                '</td>');

        case 'updated':
            return $('<td class="updated">' +
                '<time title="' + moment(pr['updatedDate']).format("D MMMM YYYY HH:mm") + '" ' +
                'datetime="' + moment(pr['updatedDate']).format() + '">'
                + moment(pr['updatedDate']).fromNow() + '</time></td>');

        default:
            return $('<td class="repository"></td>');
    }
}

function mkTR(pr) {
    var tr = $('<tr data-pullrequestid="' + pr['id'] + '" class="pull-request-row current-user"></tr>');
    var tds = ['repository', 'title', 'author', 'reviewers', 'comment-count', 'task-count', 'source', 'destination', 'updated'];

    var mkTDPartial = _.partial(mkTD, pr);
    return Promise.map(tds, mkTDPartial)
        .each(function (td) {
            tr.append(td)
        })
        .then(function () {
            return tr;
        });
}

function divBase(id, title, ignoreThead) {
    return $('<div><div id="' + (id || '') + '" class="tabs-pane active-pane" aria-hidden="false">' +
        ((title && !(localStorage["_hide_section_title"] == "true")) ? ('<div class="aui-inline-dialog-contents contents" style="width: 870px; max-height: 718px;"><h4>' + title + '</h4></div>') : '') +
        '<table class="aui paged-table pull-requests-table" id="' + id + '" data-last-updated="' + Date.now() + '" style="display: table;">' +
        (ignoreThead ? "" : '<thead><tr>' +
        '<th class="repository" scope="col">Repository</th>' +
        '<th class="title" scope="col">Title</th>' +
        '<th class="author" scope="col">Author</th>' +
        '<th class="reviewers" scope="col">Reviewers</th>' +
        '<th class="comment-count" scope="col"></th>' +
        '<th class="pull-request-list-task-count-column" title="" scope="col"></th>' +
        '<th class="source" scope="col">Source</th><th class="destination" scope="col">Destination</th>' +
        '<th class="updated" scope="col">Updated</th></tr></thead>') +
        '<tbody></tbody></table></div></div>');
}

function mkDIV(data, divId, divTitle){

    var div = divBase(divId, divTitle + " (" + data.values.length + ")");
    return Promise.map(data.values, mkTR)
        .each(function (tr) {
            div.find('tbody').append(tr);
        })
        .then(function () {
            return div.html();
        })

}