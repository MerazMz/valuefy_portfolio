const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  const data = db.prepare("SELECT * FROM model_funds").all();
  res.json(data);
});

router.post("/", (req, res) => {
    const { updates } = req.body; // Expecting [{ fund_id, allocation_pct }, ...]
    
    if (!updates || !Array.isArray(updates)) {
        return res.status(400).json({ error: "Invalid updates format. Expected an array of updates." });
    }

    const totalAllocation = updates.reduce((acc, curr) => acc + Number(curr.allocation_pct), 0);
    
    // Check against 100
    if (Math.abs(totalAllocation - 100) > 0.01) {
        return res.status(400).json({ error: `Total allocation must equal 100%. Currently ${totalAllocation}%` });
    }

    try {
        const updateStmt = db.prepare("UPDATE model_funds SET allocation_pct = ? WHERE fund_id = ?");
        
        db.transaction(() => {
            updates.forEach(u => {
                updateStmt.run(u.allocation_pct, u.fund_id);
            });
        })();
        
        res.json({ message: "Model portfolio updated successfully!" });
    } catch (err) {
        console.error("Failed to update models:", err);
        res.status(500).json({ error: "Database update failed." });
    }
});

module.exports = router;