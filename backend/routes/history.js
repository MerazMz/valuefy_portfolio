const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  try {
      const data = db.prepare(`
        SELECT session_id, created_at, portfolio_value, total_to_buy, total_to_sell, net_cash_needed, status 
        FROM rebalance_sessions 
        WHERE client_id = 'C001'
        ORDER BY created_at DESC
      `).all();
      res.json(data);
  } catch(err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;
