import path from 'path';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { Lib } from 'lance-gg';
import WiggleServerEngine from './server/WiggleServerEngine.js';
import WiggleGameEngine from './common/WiggleGameEngine.js';
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
const gameEngine = new WiggleGameEngine({ traceLevel: Lib.Trace.TRACE_NONE });
const serverEngine = new WiggleServerEngine(io, gameEngine, { tracesPath: './'});

// start the game
serverEngine.start();
