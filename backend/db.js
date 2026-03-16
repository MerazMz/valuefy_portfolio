const Database = require("better-sqlite3");

const db = new Database("../model_portfolio.db");

module.exports = db;