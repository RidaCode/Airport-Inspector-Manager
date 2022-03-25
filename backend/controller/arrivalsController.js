const asyncHandler = require("express-async-handler");

const ArrivalFlight = require("../models/arrivalFlight");

//Get all the sorted arrivals flights
const getArrival = asyncHandler(async (req, res) => {
  const arrivalFlightsSorted = await ArrivalFlight.find().sort({ _id: 1 });
  res.status(200).json(arrivalFlightsSorted);
});

//Get all the late arrival flights
const getArrivalLate = asyncHandler(async (req, res) => {
  const arrivalFlightsLate = await ArrivalFlight.find({ isLate: true }).sort({
    _id: 1,
  });
  res.status(200).json(arrivalFlightsLate);
});

//Get all the early arrival flights
const getArrivalEarly = asyncHandler(async (req, res) => {
  const arrivalFlightsEarly = await ArrivalFlight.find({ isEarly: true }).sort({
    _id: 1,
  });
  res.status(200).json(arrivalFlightsEarly);
});

//Get all the ontime arrival flights
const getArrivalOnTime = asyncHandler(async (req, res) => {
  const arrivalFlightsOnTime = await ArrivalFlight.find({
    isOnTime: true,
  }).sort({ _id: 1 });
  res.status(200).json(arrivalFlightsOnTime);
});

module.exports = {
  getArrival,
  getArrivalLate,
  getArrivalEarly,
  getArrivalOnTime,
};
