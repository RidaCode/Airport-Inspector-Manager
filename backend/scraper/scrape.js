require("dotenv").config({ path: "../.env" });
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const airportsInfo = require("./airportsInfo.json");

// scrape();

async function scrape() {
  console.log("Scraping...");
  await axios
    .get(process.env.TARGET_TABLE_URL)
    .then(async (response) => {
      const $ = cheerio.load(response.data);

      const arrivalTableSelector = $(
        "#form1 > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(1) > table > tbody"
      )
        .children()
        .slice(2);

      const departureTableSelector = $(
        "#form1 > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(2) > table > tbody"
      )
        .children()
        .slice(2);

      const arrivalFlights = [];
      const departureFlights = [];

      // Arrival
      arrivalTableSelector.each(async (i, el) => {
        const flight = {};
        const row = $(el);
        const cells = row.children();

        flight.flightNumber = getFlightNumber(0, cells);
        flight.acReg = grabCell(1, cells);
        flight.fm = grabCell(2, cells);
        flight.city = cityFinder(grabCell(2, cells));
        flight.airportName = airportNameFinder(grabCell(2, cells));
        flight.sta24Format = grabCell(3, cells);
        flight.eta24Format = grabCell(4, cells);
        flight.sta12Format = convertTime(grabCell(3, cells));
        flight.eta12Format = convertTime(grabCell(4, cells));
        flight.pax = grabCell(5, cells);
        flight.conPax = grabCell(6, cells);
        flight.conBag = grabCell(7, cells);
        flight.splRqst = grabCell(8, cells);
        flight.gateStand = grabCell(9, cells);
        flight.isLate = isLate(grabCell(3, cells), grabCell(4, cells));
        flight.isEarly = isEarly(grabCell(3, cells), grabCell(4, cells));
        flight.isOnTime = isOnTime(grabCell(3, cells), grabCell(4, cells));
        flight.lateEarlyBy = timeDiffrance(
          grabCell(3, cells),
          grabCell(4, cells)
        );

        arrivalFlights.push(flight);
      });
      // console.log("Arrival flights pushed to [FlightsDB.arrivalFlights]");

      // Departure
      departureTableSelector.each((i, el) => {
        const flight = {};
        const row = $(el);
        const cells = row.children();

        flight.flightNumber = getFlightNumber(0, cells);
        flight.acReg = grabCell(1, cells);
        flight.to = grabCell(2, cells);
        flight.city = cityFinder(grabCell(2, cells));
        flight.airportName = airportNameFinder(grabCell(2, cells));
        flight.std24Format = grabCell(3, cells);
        flight.etd24Format = grabCell(4, cells);
        flight.std12Format = convertTime(grabCell(3, cells));
        flight.etd12Format = convertTime(grabCell(4, cells));
        flight.pax = grabCell(5, cells);
        flight.conPax = grabCell(6, cells);
        flight.gateStand = grabCell(7, cells);
        flight.isLate = isLate(grabCell(3, cells), grabCell(4, cells));
        flight.isEarly = isEarly(grabCell(3, cells), grabCell(4, cells));
        flight.isOnTime = isOnTime(grabCell(3, cells), grabCell(4, cells));
        flight.lateEarlyBy = timeDiffrance(
          grabCell(3, cells),
          grabCell(4, cells)
        );

        departureFlights.push(flight);
      });
      // console.log("Departure flights pushed to [FlightsDB.departureFlights]");

      return await exportToJson();

      // function that update json file from arrivalFlights and departureFlights arrays
      async function exportToJson() {
        fs.writeFile(
          "./arrivalFlights.json",
          JSON.stringify(arrivalFlights),
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );
        console.log("arrivalFlights.json file created");
        fs.writeFile(
          "./departureFlights.json",
          JSON.stringify(departureFlights),
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );
        console.log("departureFlights.json file created");
      }

      //Format Data
      function grabCell(index, parent) {
        let cell = parent.eq(index).text().replaceAll(" ", "");
        if (isInt(cell) === true) {
          return parseInt(cell);
        }
        return cell;
      }

      function getFlightNumber(index, parent) {
        let cell = parent.eq(index).text().replaceAll(" ", "");
        return cell;
      }

      //Check if String is a Number only, true = number.
      function isInt(str) {
        return !isNaN(str) && Number.isInteger(parseFloat(str));
      }

      //Convert time from 24hr to 12hr and adds AM/PM
      function convertTime(str) {
        hours = str.substring(0, 2);
        mins = str.substring(3, 5);
        AmOrPm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        finalTime = hours + ":" + mins + " " + AmOrPm;
        return finalTime;
      }

      function isLate(setTime, estimatedTime) {
        // return true or false
        setTime = TurnZeroHoursTo24(setTime);
        setTimeHours = HoursToNum(setTime);
        setTimeMins = MinsToNum(setTime);
        estimatedTime = TurnZeroHoursTo24(estimatedTime);
        estimatedTimeHours = HoursToNum(estimatedTime);
        estimatedTimeMins = MinsToNum(estimatedTime);
        if (
          estimatedTimeHours > setTimeHours ||
          (estimatedTimeHours === setTimeHours &&
            estimatedTimeMins > setTimeMins)
        ) {
          return true;
        } else {
          return false;
        }
      }

      function timeDiffrance(setTime, estimatedTime) {
        // check if setTime and estimatedTime result isEarly = true then do return subtractTimeStrings(setTime,estimatedTime). else if setTime and estimatedTime result isLate = true then subtractTimeStrings(estimatedTime, setTime). else return `0hr 0min` because it's ontime.
        setTime = TurnZeroHoursTo24(setTime);
        setTimeHours = HoursToNum(setTime);
        setTimeMins = MinsToNum(setTime);
        estimatedTime = TurnZeroHoursTo24(estimatedTime);
        estimatedTimeHours = HoursToNum(estimatedTime);
        estimatedTimeMins = MinsToNum(estimatedTime);
        if (
          estimatedTimeHours > setTimeHours ||
          (estimatedTimeHours === setTimeHours &&
            estimatedTimeMins > setTimeMins)
        ) {
          return subtractTimeStrings(estimatedTime, setTime);
        } else if (
          estimatedTimeHours < setTimeHours ||
          (estimatedTimeHours === setTimeHours &&
            estimatedTimeMins < setTimeMins)
        ) {
          return subtractTimeStrings(setTime, estimatedTime);
        } else {
          return `0hr 0min`;
        }
      }

      function isEarly(setTime, estimatedTime) {
        setTime = TurnZeroHoursTo24(setTime);
        setTimeHours = HoursToNum(setTime);
        setTimeMins = MinsToNum(setTime);
        estimatedTime = TurnZeroHoursTo24(estimatedTime);
        estimatedTimeHours = HoursToNum(estimatedTime);
        estimatedTimeMins = MinsToNum(estimatedTime);
        if (
          estimatedTimeHours < setTimeHours ||
          (estimatedTimeHours === setTimeHours &&
            estimatedTimeMins < setTimeMins)
        ) {
          return true;
        } else {
          return false;
        }
      }

      function isOnTime(setTime, estimatedTime) {
        setTime = TurnZeroHoursTo24(setTime);
        setTimeHours = HoursToNum(setTime);
        setTimeMins = MinsToNum(setTime);
        estimatedTime = TurnZeroHoursTo24(estimatedTime);
        estimatedTimeHours = HoursToNum(estimatedTime);
        estimatedTimeMins = MinsToNum(estimatedTime);
        if (
          estimatedTimeHours === setTimeHours &&
          estimatedTimeMins === setTimeMins
        ) {
          return true;
        } else {
          return false;
        }
      }

      //Subtract two time strings format 24:00,
      function subtractTimeStrings(str1, str2) {
        hoursStr1 = HoursToNum(str1);
        minsStr1 = MinsToNum(str1);
        hoursStr2 = HoursToNum(str2);
        minsStr2 = MinsToNum(str2);
        if (hoursStr1 === 00) {
          hoursStr1 = 24;
        } else if (hoursStr2 === 00) {
          hoursStr2 = 24;
        }
        return `${Math.abs(hoursStr1 - hoursStr2)}hr ${Math.abs(
          minsStr1 - minsStr2
        )}min`;
      }

      function HoursToNum(str) {
        hours = parseInt(str.replaceAll(":", "").substring(0, 2));
        if (hours === 00) {
          hours = 24;
        }
        return hours;
      }

      function MinsToNum(str) {
        mins = parseInt(str.replaceAll(":", "").substring(2, 4));
        return mins;
      }

      // Turn Time String Hours to 24 instead of 00
      function TurnZeroHoursTo24(str) {
        hours = parseInt(str.substring(0, str.indexOf(":")));
        mins = str.substring(str.indexOf(":") + 1);
        if (hours === 00) {
          hours = 24;
          return `${hours}:${mins}`;
        } else return str;
      }

      // Find City Name
      function cityFinder(iata) {
        return airportsInfo[iata].city;
      }

      // Find Airport Name
      function airportNameFinder(iata) {
        return airportsInfo[iata].name;
      }
    })
    .catch((err) => console.log(err));
}

module.exports = scrape;
