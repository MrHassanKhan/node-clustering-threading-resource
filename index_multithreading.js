const express = require("express");
const { Worker } = require("worker_threads");

const app = express();
const port = 3000;

app.get("/non-blocking", (req, res) => {
  res.status(200).send("This page is non-blocking");
});

app.get("/blocking", async (req, res) => {
  console.time("blocking");
  const worker = new Worker("./worker/worker.js");
  worker.on("message", (message) => {
    res.status(200).send("This page is blocking, Result: " + message);
    console.timeEnd("blocking");
  });
  worker.on("error", (error) => {
    res.status(404).send("An Error Occurred: " + error);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
