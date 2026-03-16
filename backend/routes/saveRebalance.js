const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
    const { portfolio_value, total_buy, total_sell, fresh_money_needed, items } = req.body;

    try {
        const session = db.prepare(`
        INSERT INTO rebalance_sessions
        (client_id, created_at, portfolio_value, total_to_buy, total_to_sell, net_cash_needed, status)
        VALUES (?, datetime('now'), ?, ?, ?, ?, ?)
        `).run("C001", portfolio_value, total_buy, total_sell, fresh_money_needed, "PENDING");

        const sessionId = session.lastInsertRowid;

        const insertItem = db.prepare(`
        INSERT INTO rebalance_items
        (session_id, fund_id, fund_name, action, amount, current_pct, target_pct, post_rebalance_pct, is_model_fund)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        items.forEach(i => {
            insertItem.run(
                sessionId,
                i.fund_id,
                i.fund_name,
                i.action,
                i.amount,
                i.current_pct,
                i.target_pct,
                i.post_rebalance_pct,
                i.is_model_fund ? 1 : 0
            );
        });

        res.json({ message: "Rebalance saved", sessionId });
    } catch (err) {
        console.error("Error saving rebalance:", err);
        res.status(500).json({ error: "Failed to save rebalance" });
    }
});

module.exports = router;