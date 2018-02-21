Package.describe({
    name: 'haojia321:sync-async-jobs',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: 'placeholder',
    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/haojia321/sync-async-jobs',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.6.1');
    api.use('ecmascript');
    api.use('mongo');
    api.mainModule('sync-async-jobs.js');
});

Package.onTest(function(api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('haojia321:sync-async-jobs');
    api.mainModule('sync-async-jobs-tests.js');
});