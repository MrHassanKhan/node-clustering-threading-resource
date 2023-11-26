const express = require("express");
const { Worker } = require("worker_threads");

const app = express();
const port = 3000;
const THREAD_COUNT = 4;

app.get("/non-blocking", (req, res) => {
  res.status(200).send("This page is non-blocking");
});
function createWorker() {
  // const workers = [];
  // for (let i = 0; i < THREAD_COUNT; i++) {
  //   workers.push(new Worker("./worker/worker.js"));
  // }
  // return workers;

  return new Promise((resolve, reject) => {
    const worker = new Worker("./worker/worker.js", {
      workerData: { thread_count: THREAD_COUNT },
    });
    worker.on("message", (message) => {
      resolve(message);
    });
    worker.on("error", (error) => {
      reject(error);
    })
  })
}

app.get("/blocking", async (req, res) => {
  console.time("blocking");
  const workers = [];
  for (let i = 0; i < THREAD_COUNT; i++) {
    workers.push(createWorker());
  }
  const thread_results = await Promise.all(workers);
  const total = thread_results[0] + thread_results[1] + thread_results[2] + thread_results[3];
  console.timeEnd("blocking");
  res.status(200).send(`This page is blocking, Result:  ${total}`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
