const cron = require("node-cron");
const mongoose = require("mongoose");

// making sure we closed all connections before running cron
disconnectDB();

// close and disconnect
async function disconnectDB() {
  await mongoose.connection.close();
  return await mongoose.disconnect();
}

// execute refreshDB.js every 1 minute
cron.schedule("*/1 * * * *", function () {
  var shell = require("./child_helper");

  var commandList = ["node refreshDB.js"];

  shell.series(commandList, function (err) {
    //    console.log('executed many commands in a row');
    console.log("Cron Job Done!");
  });
});

// close connections to DB when the process ends
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("Mongoose connection closed");
    process.exit(0);
  });
});
