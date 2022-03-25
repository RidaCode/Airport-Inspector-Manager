const scrape = require("./scrape");
const pushToDB = require("./pushToDB");
const wipeDB = require("./wipeDB");
const connectDB = require(".././config/db");
const mongoose = require("mongoose");

refreshDB();

async function refreshDB() {
  await connectDB();
  await scrape();
  await wipeDB();
  await pushToDB();
  await mongoose.connection.close();
  return await mongoose.disconnect();
}
