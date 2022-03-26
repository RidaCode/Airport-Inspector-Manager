const cron = require("node-cron");

// execute refreshDB.js every 1 minute
cron.schedule("*/1 * * * *", function () {
  var shell = require("./child_helper");

  var commandList = ["node refreshDB.js"];

  shell.series(commandList, function (err) {
    //    console.log('executed many commands in a row');
    console.log("Cron Job Done!");
  });
});
