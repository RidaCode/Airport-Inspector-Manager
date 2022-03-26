require("dotenv").config({ path: "../.env" });
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const utils = require("./utils/scrapeFunctions.js");

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
        this.flightNumber = utils.getFlightNumber(0, cells);
        this.acReg = utils.grabCell(1, cells);
        this.fm = utils.grabCell(2, cells);
        this.city = utils.cityFinder(utils.grabCell(2, cells));
        this.airportName = utils.airportNameFinder(utils.grabCell(2, cells));
        this.sta24Format = utils.grabCell(3, cells);
        this.eta24Format = utils.grabCell(4, cells);
        this.sta12Format = utils.convertTime(utils.grabCell(3, cells));
        this.eta12Format = utils.convertTime(utils.grabCell(4, cells));
        this.pax = utils.grabCell(5, cells);
        this.conPax = utils.grabCell(6, cells);
        this.conBag = utils.grabCell(7, cells);
        this.splRqst = utils.grabCell(8, cells);
        this.gateStand = utils.grabCell(9, cells);
        this.isLate = utils.isLate(
          utils.grabCell(3, cells),
          utils.grabCell(4, cells)
        );
        this.isEarly = utils.isEarly(
          utils.grabCell(3, cells),
          utils.grabCell(4, cells)
        );
        this.isOnTime = utils.isOnTime(
          utils.grabCell(3, cells),
          utils.grabCell(4, cells)
        );
        this.lateEarlyBy = utils.timeDiffrance(
          utils.grabCell(3, cells),
          utils.grabCell(4, cells)
        );
      }

      //Departure Flight Constructor
      function DepartureFlight(cells) {
        // cells is a jQuery Object of all the cells of a row in a table
        this.flightNumber = utils.getFlightNumber(0, cells);
        this.acReg = utils.grabCell(1, cells);
        this.to = utils.grabCell(2, cells);
        this.city = utils.cityFinder(utils.grabCell(2, cells));
        this.airportName = utils.airportNameFinder(utils.grabCell(2, cells));
        this.std24Format = utils.grabCell(3, cells);
        this.etd24Format = utils.grabCell(4, cells);
        this.std12Format = utils.convertTime(utils.grabCell(3, cells));
        this.etd12Format = utils.convertTime(utils.grabCell(4, cells));
        this.pax = utils.grabCell(5, cells);
        this.conPax = utils.grabCell(6, cells);
        this.gateStand = utils.grabCell(7, cells);
        this.isLate = utils.isLate(
          utils.grabCell(3, cells),
          utils.grabCell(4, cells)
        );
        this.isEarly = utils.isEarly(
          utils.grabCell(3, cells),
          utils.grabCell(4, cells)
        );
        this.isOnTime = utils.isOnTime(
          utils.grabCell(3, cells),
          utils.grabCell(4, cells)
        );
        this.lateEarlyBy = utils.timeDiffrance(
          utils.grabCell(3, cells),
          utils.grabCell(4, cells)
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
    })
    .catch((err) => console.log(err));
}

module.exports = scrape;
