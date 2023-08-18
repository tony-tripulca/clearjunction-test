const express = require("express");
const crypto = require("crypto");
const axios = require("axios");

require("dotenv").config();

const app = express();

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});

function hashPassword() {
  let hash = crypto.createHash("sha512");
  data = hash.update(process.env.API_PASSWORD);
  return data.digest("hex");
}

app.get("/", (req, res) => {
  res.json({ routes: ["/", "/transaction-reports"] });
});

app.get("/transaction-reports", (req, res) => {
  let hash = crypto.createHash("sha512");

  let xApiKey = process.env.X_API_KEY.toUpperCase();
  let date = new Date().toISOString();
  let hashPass = hashPassword().toUpperCase();
  let body = JSON.stringify({
    walletUuid: "348e11ab-dbfb-4ae8-99e7-349b00868f6f",
    timestampFrom: "2017-09-05T00:00:00+00:00",
    timestampTo: "2017-09-12T00:00:00+00:00",
  });

  signature = `${xApiKey}${date}${hashPass}${body}`;
  hashSignature = hash.update(signature).digest("hex");

  axios({
    method: "POST",
    baseURL: process.env.SANDBOX_HOST,
    url: `/v7/gate/reports/transactionReport`,
    params: {},
    headers: {
      "Content-Type": "application/json",
      Date: date,
      "X-API-KEY": process.env.X_API_KEY,
      signature: signature,
      Authorization: hashSignature,
    },
    data: body,
  })
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.send(error);
    });
});
