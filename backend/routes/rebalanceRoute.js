const express = require("express");
const router = express.Router();
const db = require("../db");
const calculateRebalance = require("../rebalance");

router.get("/", (req, res) => {

    const holdings = db.prepare(
        "SELECT * FROM client_holdings WHERE client_id='C001'"
    ).all();

    const modelFunds = db.prepare(
        "SELECT * FROM model_funds"
    ).all();

    const result = calculateRebalance(holdings, modelFunds);

    res.json(result);
});

module.exports = router;