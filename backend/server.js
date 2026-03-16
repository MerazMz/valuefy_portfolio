const express = require("express");
const cors = require("cors");

const holdingsRoute = require("./routes/holdings");
const modelRoute = require("./routes/model");
const rebalanceRoute = require("./routes/rebalanceRoute");
const saveRebalance = require("./routes/saveRebalance");
const historyRoute = require("./routes/history");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/holdings", holdingsRoute);
app.use("/model", modelRoute);
app.use("/rebalance", rebalanceRoute);
app.use("/save", saveRebalance);
app.use("/history", historyRoute);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});