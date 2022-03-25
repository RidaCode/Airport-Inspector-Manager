const express = require("express");
const router = express.Router();

const {
  getArrival,
  getArrivalLate,
  getArrivalEarly,
  getArrivalOnTime,
} = require("../controller/arrivalsController");

router.route("/").get(getArrival);
router.route("/ontime").get(getArrivalOnTime);
router.route("/late").get(getArrivalLate);
router.route("/early").get(getArrivalEarly);

module.exports = router;
