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

      //Arrival Flight Constructor
      function ArrivalFlight(cells) {
        // cells is a jQuery Object of all the cells of a row in a table
        this.flightNumber = getFlightNumber(0, cells);
        this.acReg = grabCell(1, cells);
        this.fm = grabCell(2, cells);
        this.city = cityFinder(grabCell(2, cells));
        this.airportName = airportNameFinder(grabCell(2, cells));
        this.sta24Format = grabCell(3, cells);
        this.eta24Format = grabCell(4, cells);
        this.sta12Format = convertTime(grabCell(3, cells));
        this.eta12Format = convertTime(grabCell(4, cells));
        this.pax = grabCell(5, cells);
        this.conPax = grabCell(6, cells);
        this.conBag = grabCell(7, cells);
        this.splRqst = grabCell(8, cells);
        this.gateStand = grabCell(9, cells);
        this.isLate = isLate(grabCell(3, cells), grabCell(4, cells));
        this.isEarly = isEarly(grabCell(3, cells), grabCell(4, cells));
        this.isOnTime = isOnTime(grabCell(3, cells), grabCell(4, cells));
        this.lateEarlyBy = timeDiffrance(
          grabCell(3, cells),
          grabCell(4, cells)
        );
      }

      //Departure Flight Constructor
      function DepartureFlight(cells) {
        // cells is a jQuery Object of all the cells of a row in a table
        this.flightNumber = getFlightNumber(0, cells);
        this.acReg = grabCell(1, cells);
        this.to = grabCell(2, cells);
        this.city = cityFinder(grabCell(2, cells));
        this.airportName = airportNameFinder(grabCell(2, cells));
        this.std24Format = grabCell(3, cells);
        this.etd24Format = grabCell(4, cells);
        this.std12Format = convertTime(grabCell(3, cells));
        this.etd12Format = convertTime(grabCell(4, cells));
        this.pax = grabCell(5, cells);
        this.conPax = grabCell(6, cells);
        this.gateStand = grabCell(7, cells);
        this.isLate = isLate(grabCell(3, cells), grabCell(4, cells));
        this.isEarly = isEarly(grabCell(3, cells), grabCell(4, cells));
        this.isOnTime = isOnTime(grabCell(3, cells), grabCell(4, cells));
        this.lateEarlyBy = timeDiffrance(
          grabCell(3, cells),
          grabCell(4, cells)
        );
      }

      const arrivalFlights = [];
      const departureFlights = [];

      // iterate through all the rows in the table and create a new flight object for each row in the table and push it to the array of arrivalFlights
      for (let i = 0; i < arrivalTableSelector.length; i++) {
        // cells is a jQuery Object of all the cells in the row of the table
        const cells = arrivalTableSelector.eq(i).children();
        const arrivalFlight = new ArrivalFlight(cells);
        arrivalFlights.push(arrivalFlight);
      }

      // iterate through all the rows in the table and create a new flight object for each row in the table and push it to the array of departureFlights
      for (let i = 0; i < departureTableSelector.length; i++) {
        // cells is a jQuery Object of all the cells in the row of the table
        const cells = departureTableSelector.eq(i).children();
        const departureFlight = new DepartureFlight(cells);
        departureFlights.push(departureFlight);
      }

      // Export to Arrays to JSON files from the scrape
      return await exportToJson();

      // Take arrivalFlights and departureFlights arrays
      // and create a new JSON file arrivalFlights.json and departureFlights.json
      // with the data from the arrays
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

      //Get Flight Number string
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

      // check if flight is late
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

      // check if setTime and estimatedTime result isEarly = true then do return subtractTimeStrings(setTime,estimatedTime). else if setTime and estimatedTime result isLate = true then subtractTimeStrings(estimatedTime, setTime). else return `0hr 0min` because it's ontime.
      function timeDiffrance(setTime, estimatedTime) {
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

      // Check if flight is early
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

      // Check if flight is on time
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

      // Subtract two time strings format 24:00,
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

      // Check if hours is equal to 00 and change to 24 if true and return as a number
      function HoursToNum(str) {
        hours = parseInt(str.replaceAll(":", "").substring(0, 2));
        if (hours === 00) {
          hours = 24;
        }
        return hours;
      }

      // Turn minutes to number and return as a number
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
