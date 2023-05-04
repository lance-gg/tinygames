import { ServerEngine } from "lance-gg";
import { debounce } from "throttle-debounce";
import url from "url";
import Wiggle from "../common/Wiggle";
import Food from "../common/Food";
import { Leaderboard, VisitorInfo } from "../rtsdk";
const nameGenerator = require("./NameGenerator");

export default class WiggleServerEngine extends ServerEngine {
  constructor(io, gameEngine, inputOptions) {
    super(io, gameEngine, inputOptions);
    this.gameEngine.on("postStep", this.stepLogic.bind(this));
    this.scoreData = {};
    this.aiTracker = {}; // Add AI when person is first to enter room.  Remove when last to leave.
    this.foodTracker = {}; // Add food when person is first to enter room.  Remove when last to leave.
    this.roomTracker = {}; // Used to add and remove AIs from used / unused worlds.
  }

  // create food and AI robots
  start() {
    super.start();
  }

  addAI(roomName) {
    let newAI = new Wiggle(this.gameEngine, null, { position: this.gameEngine.randPos() });
    newAI.AI = true;
    newAI.direction = 0;
    newAI.turnDirection = 1;
    newAI.bodyLength = this.gameEngine.startBodyLength;
    newAI.playerId = 0;
    newAI.name = nameGenerator("general") + "Bot";
    newAI.roomName = roomName;
    this.gameEngine.addObjectToWorld(newAI);
    this.assignObjectToRoom(newAI, roomName);
  }

  addFood(roomName) {
    let newF = new Food(this.gameEngine, null, { position: this.gameEngine.randPos() });
    newF.roomName = roomName;
    this.gameEngine.addObjectToWorld(newF);
    this.assignObjectToRoom(newF, roomName);
  }

  generateRoom(roomName) {
    for (let f = 0; f < this.gameEngine.foodCount; f++) this.addFood(roomName);
    for (let ai = 0; ai < this.gameEngine.aiCount; ai++) this.addAI(roomName);
  }

  onPlayerConnected(socket) {
    super.onPlayerConnected(socket);
    this.joinRoom(socket);
  }

  async joinRoom(socket) {
    const URL = socket.handshake.headers.referer;
    const parts = url.parse(URL, true);
    const query = parts.query;
    const { assetId, urlSlug } = query;
    const req = { body: query }; // Used for interactive assets

    const gameStatus = this.gameStatus();
    const rooms = this.rooms;
    // console.log("Game Status", gameStatus);
    // console.log("Rooms", rooms);

    // Only update leaderboard once every 5 seconds.
    const debounceLeaderboard = debounce(
      3000,
      (leaderboardArray, req, username) => {
        console.log(`${username} updating leaderboard`, leaderboardArray);
        Leaderboard.update({ leaderboardArray, req });
      },
      { atBegin: false },
    );

    const { isAdmin, roomName, username } = await VisitorInfo.getRoomAndUsername({ query });

    if (isAdmin) {
      socket.emit("isadmin"); // Shows admin controls on landing page
      socket.on("showLeaderboard", () => Leaderboard.show({ assetId, req, urlSlug }));
      socket.on("hideLeaderboard", () => Leaderboard.hide({ req }));
      // socket.on("resetLeaderboard", resetLeaderboard); // Used to reset high score.
    }

    if (!roomName) {
      socket.emit("notinroom");
      return;
    }

    if (!this.rooms || !this.rooms[roomName]) {
      await super.createRoom(roomName);
    }

    super.assignPlayerToRoom(socket.playerId, roomName);
    this.roomTracker[roomName] = this.roomTracker[roomName] || 0;
    if (this.roomTracker[roomName] === 0) this.generateRoom(roomName);
    this.roomTracker[roomName]++;
    this.scoreData[roomName] = this.scoreData[roomName] || {};

    if (username === -1) {
      socket.emit("error");
      return;
    }

    if (username) {
      socket.on("updateLeaderboard", (leaderboardArray) => debounceLeaderboard(leaderboardArray, req, username));
      socket.emit("inzone");

      let player = new Wiggle(this.gameEngine, null, { position: this.gameEngine.randPos() });
      player.direction = 0;
      player.bodyLength = this.gameEngine.startBodyLength;
      player.playerId = socket.playerId;
      player.name = username;
      // player.name = nameGenerator("general");
      this.gameEngine.addObjectToWorld(player);
      this.assignObjectToRoom(player, roomName);

      // this.updateScore();

      // handle client restart requests
      // socket.on("requestRestart", makePlayerShip);
    } else {
      // User is spectating because not in private zone
      socket.emit("spectating");
      // this.updateScore();
    }
  }

  onPlayerDisconnected(socketId, playerId) {
    super.onPlayerDisconnected(socketId, playerId);
    let playerWiggle = this.gameEngine.world.queryObject({ playerId });
    if (playerWiggle) {
      console.log("Player left room", playerWiggle.roomName);
      this.roomTracker[playerWiggle.roomName]--;
      this.gameEngine.removeObjectFromWorld(playerWiggle.id);
    }
  }

  // Eating Food:
  // increase body length, and remove the food
  wiggleEatFood(w, f) {
    if (!(f.id in this.gameEngine.world.objects)) return;
    this.gameEngine.removeObjectFromWorld(f);
    w.bodyLength++;
    this.addFood(f.roomName);
  }

  wiggleHitWiggle(w1, w2) {
    if (!(w2.id in this.gameEngine.world.objects) || !(w1.id in this.gameEngine.world.objects)) return;
    w2.bodyLength += w1.bodyLength / 4;
    this.wiggleDestroyed(w1);
  }

  wiggleDestroyed(w) {
    if (!(w.id in this.gameEngine.world.objects)) return;
    this.gameEngine.removeObjectFromWorld(w);
    if (w.AI) this.addAI(w.roomName);
  }

  stepLogic() {
    let wiggles = this.gameEngine.world.queryObjects({ instanceType: Wiggle });
    let foodObjects = this.gameEngine.world.queryObjects({ instanceType: Food });
    for (let w of wiggles) {
      // check for collision
      for (let w2 of wiggles) {
        if (w === w2) continue;

        for (let i = 0; i < w2.bodyParts.length; i++) {
          let distance = w2.bodyParts[i].clone().subtract(w.position);
          if (distance.length() < this.gameEngine.collideDistance) this.wiggleHitWiggle(w, w2);
        }
      }

      // check for food-eating
      for (let f of foodObjects) {
        let distance = w.position.clone().subtract(f.position);
        if (distance.length() < this.gameEngine.eatDistance) {
          this.wiggleEatFood(w, f);
        }
      }

      // Slowly (and somewhat randomly) reduce length to prevent just sitting
      if (Math.random() < 0.03) {
        w.bodyLength -= w.bodyLength * this.gameEngine.hungerTick;
        if (w.bodyLength < 1) this.wiggleDestroyed(w);
      }

      // move AI wiggles
      if (w.AI) {
        if (Math.random() < 0.01) w.turnDirection *= -1;
        w.direction += (w.turnDirection * (Math.random() - 0.9)) / 20;
        if (w.position.y >= this.gameEngine.spaceHeight / 2) w.direction = -Math.PI / 2;
        if (w.position.y <= -this.gameEngine.spaceHeight / 2) w.direction = Math.PI / 2;
        if (w.position.x >= this.gameEngine.spaceWidth / 2) w.direction = Math.PI;
        if (w.position.x <= -this.gameEngine.spaceWidth / 2) w.direction = 0;
        if (w.direction > Math.PI * 2) w.direction -= Math.PI * 2;
        if (w.direction < 0) w.direction += Math.PI * 2;
      }
    }
  }
}
