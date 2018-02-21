// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by sync-async-jobs.js.
import { name as packageName } from "meteor/sync-async-jobs";

// Write your tests here!
// Here is an example.
Tinytest.add('sync-async-jobs - example', function (test) {
  test.equal(packageName, "sync-async-jobs");
});
