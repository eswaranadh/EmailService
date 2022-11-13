const functions = require("firebase-functions");
const app = require("express")();
const cors = require("cors")({ origin: true });
app.use(cors);

app.use("/mailService", require("./Email/controller"));
exports.api = functions.https.onRequest(app);


