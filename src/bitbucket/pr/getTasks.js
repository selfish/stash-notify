function getTasksByPR(pr, limit) {
    console.warn("getTasksByPR pr:", pr, "limit:", limit);
    return najax(host("/rest/api/latest" + pr["links"]["self"][0]["href"] + "/tasks?start=0&limit=" + (limit || 5)))
        .then(function (taskData) {
            return JSON.parse(taskData).values.map(function (t) {
                return {text: t.text, author: t.author.displayName, state: t.state, created: t.createdDate}
            });
        })
}

module.exports = function getTasksByPr(host, project, repo, pr)

module.exports = function getTasks (host, project, repo, pr) {
    return new Promise (function (resolve, reject) {

    })
}

module.exports = function getTasks (host, project, repo, pr) {
    return new Promise((resolve, reject) => {
        const uri = [
            host, 'projects',
            project, 'repos',
            repo, 'pull-requests',
            pr
        ]`${host}/projects/${project}/repos/${repo}/pull-requests${pr}`
    });
}
