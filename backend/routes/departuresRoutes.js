const express = require("express");
const router = express.Router();
const {
  getDeparture,
  getDepartureLate,
  getDepartureEarly,
  getDepartureOnTime,
} = require("../controller/departuresController");

router.route("/").get(getDeparture);
router.route("/late").get(getDepartureLate);
router.route("/early").get(getDepartureEarly);
router.route("/ontime").get(getDepartureOnTime);

module.exports = router;
