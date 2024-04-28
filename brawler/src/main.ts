import path from 'path';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { Lib } from 'lance-gg';
import BrawlerServerEngine from './server/BrawlerServerEngine.js';
import BrawlerGameEngine from './common/BrawlerGameEngine.js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, '../dist/index.html');

// define routes and socket
const app = express();
const server = createServer(app);
app.get('/', function(req, res) { res.sendFile(INDEX); });
app.use('/', express.static(path.join(__dirname, '../dist/')));
let requestHandler = server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
const io = new Server(server);

// Game Instances
const gameEngine = new BrawlerGameEngine({ traceLevel: Lib.Trace.TRACE_ALL });
const serverEngine = new BrawlerServerEngine(io, gameEngine, { updateRate: 6 });

// start the game
serverEngine.start();
