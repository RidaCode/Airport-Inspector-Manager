const airportsInfo = require("./airportsInfo.json");

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
    (estimatedTimeHours === setTimeHours && estimatedTimeMins > setTimeMins)
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
    (estimatedTimeHours === setTimeHours && estimatedTimeMins > setTimeMins)
  ) {
    return subtractTimeStrings(estimatedTime, setTime);
  } else if (
    estimatedTimeHours < setTimeHours ||
    (estimatedTimeHours === setTimeHours && estimatedTimeMins < setTimeMins)
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
    (estimatedTimeHours === setTimeHours && estimatedTimeMins < setTimeMins)
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

module.exports = {
  grabCell,
  getFlightNumber,
  isInt,
  convertTime,
  isLate,
  timeDiffrance,
  isEarly,
  isOnTime,
  subtractTimeStrings,
  HoursToNum,
  MinsToNum,
  TurnZeroHoursTo24,
  cityFinder,
  airportNameFinder,
};
