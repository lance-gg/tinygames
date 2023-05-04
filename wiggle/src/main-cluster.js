const cluster = require("cluster");
import path from "path";
import express from "express";
import socketIO from "socket.io";
import url from "url";
// const http = require("http");
// const { Server } = require("socket.io");
// const { IPCAdapter } = require("socket.io-adapter-ipc");
import { Lib } from "lance-gg";
import WiggleServerEngine from "./server/WiggleServerEngine";
import WiggleGameEngine from "./common/WiggleGameEngine";

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, "../dist/index.html");

const numWorkers = require("os").cpus().length;

if (cluster.isMaster) {
  console.log("Master process is running");

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  const roomToWorkerMap = {};

  cluster.on("message", (worker, { type, room }) => {
    if (type === "roomRequest") {
      console.log(room);
      if (!roomToWorkerMap[room]) {
        const workerIndex = Object.keys(roomToWorkerMap).length % numWorkers;
        console.log("Index", workerIndex);
        roomToWorkerMap[room] = cluster.workers[workerIndex + 1];
        console.log("Worker", roomToWorkerMap[room]);
      }
      // console.log("workers", cluster.workers);

      worker.send({ type: "roomAssignment", workerPid: roomToWorkerMap[room].process.pid });
    }
  });
} else {
  // define routes and socket
  const server = express();
  server.get("/", function (req, res) {
    res.sendFile(INDEX);
  });
  server.use("/", express.static(path.join(__dirname, "../dist/")));
  let requestHandler = server.listen(PORT, () => console.log(`Listening on ${PORT}`));
  const io = socketIO(requestHandler);

  // const httpServer = http.createServer();

  // const io = new Server(requestHandler, {
  //   adapter: IPCAdapter(),
  // });

  // const io = new Server(requestHandler);
  const gameEngine = new WiggleGameEngine({ traceLevel: Lib.Trace.TRACE_NONE });
  const serverEngine = new WiggleServerEngine(io, gameEngine, { debug: {}, updateRate: 6 });

  serverEngine.start();

  // httpServer.listen(0, () => {
  //   console.log(`Worker ${process.pid} is running and listening on port ${httpServer.address().port}`);
  // });

  io.on("connection", (socket) => {
    // const room = socket.handshake.query.assetId;
    const URL = socket.handshake.headers.referer;
    const parts = url.parse(URL, true);
    const query = parts.query;
    const room = query.assetId;

    process.send({ type: "roomRequest", room });

    // Handle messages from the client
    process.on("message", ({ type, workerPid }) => {
      if (type === "roomAssignment" && workerPid === process.pid) {
        // Join the room
        socket.join(room);

        // Emit a welcome message to the client
        socket.emit("hello", `Welcome to room ${room}!`);

        // Handle messages from the client
        socket.on("message", (data) => {
          console.log(`Received message from client in room ${room}:`, data);

          // Broadcast the message to all clients in the room
          io.to(room).emit("message", `Client in room ${room} says: ${data}`);
        });

        // Handle disconnection
        socket.on("disconnect", () => {
          console.log(`Client disconnected from room ${room}`);
        });

        // Lance connection handling
        serverEngine.onPlayerConnected(socket);
        socket.on("disconnect", () => {
          serverEngine.onPlayerDisconnected(socket);
        });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Client disconnected from room ${room}`);
    });
  });
}
