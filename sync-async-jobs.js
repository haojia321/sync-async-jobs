// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See sync-async-jobs-tests.js for an example of importing.
export const name = 'sync-async-jobs';
export const Jobs = {};
let jobInfoMap = {};
BackgroundJob = new Mongo.Collection('_BackgroundJob');

Jobs.init = function(config) {
    let maxJobCount = 5;
    Meteor.setInterval(() => {
        let runningJobs = BackgroundJob.find({ status: 'started' }).fetch();
        let runningJobsCount = runningJobs.length;
        console.log('A runningJobsCount: ', runningJobsCount);
        for (let i = runningJobsCount; i < maxJobCount; i++) {
            pickJob();
        }
    }, 5000);

};

Jobs.register = function(name, jobFunction, customJobCompletedPoint) {
    jobInfoMap[name] = {
        jobFunction: jobFunction,
        customJobCompletedPoint: customJobCompletedPoint || false
    };
    console.log(jobInfoMap);
};

Jobs.run = function(obj) {
    BackgroundJob.insert({
        type: obj.type,
        priority: obj.priority,
        status: 'not_started',
        created: new Date().getTime(),
        arguments: obj.arguments
    });
};

Jobs.markJobFinished = function(jobId) {
    BackgroundJob.update({
        _id: jobId
    }, {
        $set: {
            status: 'success'
        }
    });
};

function pickJob() {
    const job = BackgroundJob.find({
        status: 'not_started'
    }, {
        sort: {
            'created': 1
        },
        limit: 1
    }).fetch()[0];
    if (job) {
        console.log('created job: ', job._id);
        BackgroundJob.update({
            _id: job._id
        }, {
            $set: {
                'status': 'started'
            }
        });
        var func = jobInfoMap[job.type].jobFunction;
        var _arguments = job.arguments;
        _arguments.push(job._id);
        func.apply(null, _arguments);
        if (!jobInfoMap[job.type].customJobCompletedPoint) {
            BackgroundJob.update({
                _id: job._id
            }, {
                $set: {
                    status: 'success'
                }
            });
        }
    }
}