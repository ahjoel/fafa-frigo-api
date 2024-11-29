//This file will help you to connect to a specific db
const mariadb = require("mariadb");
require("dotenv").config();

const dBase = mariadb.createPool({
  host: process.env.FA_HOST,
  port: process.env.FA_PORT,
  user: process.env.FA_USER,
  password: process.env.FA_PASSWORD,
  database: process.env.DB_NAME,
  timezone: 'Z'
});

// Expose the Pool object within this module
module.exports = Object.freeze({
  dBase,
});
