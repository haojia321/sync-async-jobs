JobManager = { 'CONSTANT': constant };
let jobInfoMap = {};
JobManager.init = function(config) {
    let maxJobCount = 5;
    Meteor.setInterval(() => {
        let runningJobs = _BackgroundJob.find({ status: constant['STATUS_STARTED'] }).fetch();
        let runningJobsCount = runningJobs.length;
        console.log('Running Jobs Count: ', runningJobsCount);
        for (let i = runningJobsCount; i < maxJobCount; i++) {
            pickJob();
        }
    }, 5000);

};

JobManager.register = function(name, jobFunction, customJobCompletedPoint) {
    jobInfoMap[name] = {
        jobFunction: jobFunction,
        customJobCompletedPoint: customJobCompletedPoint || false
    };
};

JobManager.run = function(obj) {
    _BackgroundJob.insert({
        type: obj.type,
        priority: obj.priority,
        status: constant['STATUS_NOT_STARTED'],
        created: new Date(),
        arguments: obj.arguments
    });
};

JobManager.markJobFinished = function(jobId) {
    _BackgroundJob.update({
        _id: jobId
    }, {
        $set: {
            status: constant['STATUS_SUCCESS']
        }
    });
};

function pickJob() {
    const job = _BackgroundJob.find({
        status: constant['STATUS_NOT_STARTED']
    }, {
        sort: {
            'created': 1
        },
        limit: 1
    }).fetch()[0];
    if (job) {
        console.log('created job: ', job._id);
        _BackgroundJob.update({
            _id: job._id
        }, {
            $set: {
                'status': constant['STATUS_STARTED']
            }
        });
        var func = jobInfoMap[job.type].jobFunction;
        var _arguments = job.arguments;
        _arguments.push(job._id);
        func.apply(null, _arguments);
        if (!jobInfoMap[job.type].customJobCompletedPoint) {
            _BackgroundJob.update({
                _id: job._id
            }, {
                $set: {
                    status: constant['STATUS_SUCCESS']
                }
            });
        }
    }
}