const express = require("express");
const cors = require("cors");

const holdingsRoute = require("./routes/holdings");
const modelRoute = require("./routes/model");
const rebalanceRoute = require("./routes/rebalanceRoute");
const saveRebalance = require("./routes/saveRebalance");
const historyRoute = require("./routes/history");

const app = express();

// Allow all origins — Vercel frontend URL gets set via CORS_ORIGIN env var
const corsOrigin = process.env.CORS_ORIGIN || "*";
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.use("/holdings", holdingsRoute);
app.use("/model", modelRoute);
app.use("/rebalance", rebalanceRoute);
app.use("/save", saveRebalance);
app.use("/history", historyRoute);

// Render injects PORT via environment variable
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});