require("dotenv").config({ path: "../.env" });
const ArrivalFlight = require("../models/arrivalFlight");
const DepartureFlight = require("../models/departureFlight");

const arrivalFlights = require("./arrivalFlights.json");
const departureFlights = require("./departureFlights.json");

async function pushToDB() {
  console.log("Pushing to database...");
  // loop through arrivalFlights.json and push each flight to ArrivalFlight model in database
  for (let i = 0; i < arrivalFlights.length; i++) {
    const newArrivalFlight = new ArrivalFlight(arrivalFlights[i]);
    newArrivalFlight;
    try {
      await newArrivalFlight.save();
    } catch (err) {
      console.log(err);
    }
  }

  // loop through departureFlights.json and push each flight to DepartureFlight model in database
  for (let i = 0; i < departureFlights.length; i++) {
    const newDepartureFlight = new DepartureFlight(departureFlights[i]);
    newDepartureFlight;
    try {
      await newDepartureFlight.save();
    } catch (err) {
      console.log(err);
    }
  }

  return console.log("Departure and Arrival flights pushed to database");
}

module.exports = pushToDB;
