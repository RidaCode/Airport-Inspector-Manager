const ArrivalFlight = require("../models/arrivalFlight");
const DepartureFlight = require("../models/departureFlight");

// wipeDB();

async function wipeDB() {
  console.log("Wiping database...");
  ArrivalFlight.deleteMany({}, (err) => {
    if (err) {
      console.log(err);
    }
  });

  DepartureFlight.deleteMany({}, (err) => {
    if (err) {
      console.log(err);
    }
  });
  console.log("Database wiped");
}

module.exports = wipeDB;
