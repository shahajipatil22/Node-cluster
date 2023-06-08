const express = require('express');
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const numWorkers = os.cpus().length;
  console.log(`Master cluster setting up ${numWorkers} workers...`);

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('online', worker => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  cluster.on('exit', worker => {
    console.log(`Worker ${worker.process.pid} has exited. Restarting...`);
    cluster.fork();
  });
} else {
  const app = express();

  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

  const port = 3000;
  app.listen(port, () => {
    console.log(`Worker ${process.pid} is listening on port ${port}`);
  });
}
