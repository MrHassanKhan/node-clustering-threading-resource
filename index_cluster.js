const express = require("express");
const cluster = require("cluster");
const os = require("os");
const process = require("process");

const app = express();
const port = 3000;
const numCPUs = os.cpus().length;

app.get("/non-blocking", (req, res) => {
  res.status(200).send("This page is non-blocking");
});

function calculateCount() {
  return new Promise((resolve, reject) => {
    let counter = 0;
    for (let i = 0; i < 20_000_000_000; i++) {
      counter++;
    }
    resolve(counter);
  });
}

app.get("/blocking", async (req, res) => {
  //   let counter = 0;
  //   for (let i = 0; i < 20_000_000_000; i++) {
  //     counter++;
  //   }
  const counter = await calculateCount();
  res.status(200).send("This page is blocking, Result: " + counter);
});

if (numCPUs > 1) {
  if (cluster.isMaster) {
    console.log(`Forking for ${numCPUs} CPUs`);
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
      if (code !== 0 && !worker.exitedAfterDisconnect) {
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork();
      }
    });
  } else {
    console.log(`Worker ${process.pid} started`);
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  }
} else {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}
