const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const departureFlightSchema = new Schema(
  {
    flightNumber: {
      type: String,
      required: true,
    },
    acReg: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    airportName: {
      type: String,
      required: true,
    },
    std24Format: {
      type: String,
      required: true,
    },
    etd24Format: {
      type: String,
      required: true,
    },
    std12Format: {
      type: String,
      required: true,
    },
    etd12Format: {
      type: String,
      required: true,
    },
    pax: {
      type: Number,
      required: true,
    },
    conPax: {
      type: Number,
      required: true,
    },
    gateStand: {
      type: String,
      required: false,
    },
    isLate: {
      type: Boolean,
      required: true,
    },
    isEarly: {
      type: Boolean,
      required: true,
    },
    isOnTime: {
      type: Boolean,
      required: true,
    },
    lateEarlyBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const DepartureFlight = mongoose.model(
  "departureFlights",
  departureFlightSchema
);

module.exports = DepartureFlight;
