const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  const data = db.prepare(
    "SELECT * FROM client_holdings WHERE client_id='C001'"
  ).all();

  res.json(data);
});

module.exports = router;