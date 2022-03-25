const asyncHandler = require("express-async-handler");

const DepartureFlight = require("../models/departureFlight");

//Get all the sorted departure flights
const getDeparture = asyncHandler(async (req, res) => {
  const departureFlightsSorted = await DepartureFlight.find().sort({ _id: 1 });
  res.status(200).json(departureFlightsSorted);
});

//Get all the late departure flights
const getDepartureLate = asyncHandler(async (req, res) => {
  const departureFlightsLate = await DepartureFlight.find({
    isLate: true,
  }).sort({
    _id: 1,
  });
  res.status(200).json(departureFlightsLate);
});

//Get all the early departure flights
const getDepartureEarly = asyncHandler(async (req, res) => {
  const departureFlightsEarly = await DepartureFlight.find({
    isEarly: true,
  }).sort({
    _id: 1,
  });
  res.status(200).json(departureFlightsEarly);
});

//Get all the ontime departure flights
const getDepartureOnTime = asyncHandler(async (req, res) => {
  const departureFlightsOnTime = await DepartureFlight.find({
    isOnTime: true,
  }).sort({ _id: 1 });
  res.status(200).json(departureFlightsOnTime);
});
module.exports = {
  getDeparture,
  getDepartureLate,
  getDepartureEarly,
  getDepartureOnTime,
};
