const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const arrivalFlightSchema = new Schema(
  {
    flightNumber: {
      type: String,
      required: true,
    },
    acReg: {
      type: String,
      required: true,
    },
    fm: {
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
    sta24Format: {
      type: String,
      required: true,
    },
    eta24Format: {
      type: String,
      required: true,
    },
    sta12Format: {
      type: String,
      required: true,
    },
    eta12Format: {
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
    conBag: {
      type: Number,
      required: true,
    },
    splRqst: {
      type: String,
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

const ArrivalFlight = mongoose.model("arrivalFlights", arrivalFlightSchema);
module.exports = ArrivalFlight;
