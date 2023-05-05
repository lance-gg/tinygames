import { ServerEngine } from "@rtsdk/lance-topia";
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
    this.debounceLeaderboard = debounce(
      3000,
      (leaderboardArray, req, username) => {
        console.log(`${username} updating leaderboard`, leaderboardArray);
        Leaderboard.update({ leaderboardArray, req });
      },
      { atBegin: false },
    );
  }

  // create food and AI robots
  start() {
    super.start();
    // this.generateRoom();
  }

  addAI(roomName) {
    let newAI = new Wiggle(this.gameEngine, null, { position: this.gameEngine.randPos() });
    newAI.AI = true;
    newAI.direction = 0;
    newAI.turnDirection = 1;
    newAI.bodyLength = this.gameEngine.startBodyLength;
    newAI.playerId = 0;
    newAI.score = 0;
    newAI.foodEaten = 0;
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

  destroyRoom(roomName) {
    let wiggles = this.gameEngine.world.queryObjects({ instanceType: Wiggle });
    let foodObjects = this.gameEngine.world.queryObjects({ instanceType: Food });

    for (let w of wiggles) {
      if (w.roomName === roomName) {
        if (!(w.id in this.gameEngine.world.objects)) return;
        this.gameEngine.removeObjectFromWorld(w);
      }
    }

    for (let f of foodObjects) {
      if (f.roomName === roomName) {
        if (!(f.id in this.gameEngine.world.objects)) return;
        this.gameEngine.removeObjectFromWorld(f);
      }
    }
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

    // const gameStatus = this.gameStatus();
    // const rooms = this.rooms;
    // console.log("Game Status", gameStatus);
    // console.log("Rooms", rooms);

    // Only update leaderboard once every 5 seconds.

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
      // socket.on("updateLeaderboard", (leaderboardArray) => debounceLeaderboard(leaderboardArray, req, username));
      socket.emit("inzone");

      let player = new Wiggle(this.gameEngine, null, { position: this.gameEngine.randPos() });
      player.direction = 0;
      player.bodyLength = this.gameEngine.startBodyLength;
      player.playerId = socket.playerId;
      player.score = 0;
      player.foodEaten = 0;
      player.name = username;
      player.req = req;
      player.roomName = roomName;
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
    // console.log(this.connectedPlayers)

    if (playerWiggle) {
      console.log("Player disconnected from room", playerWiggle.roomName);
      this.roomTracker[playerWiggle.roomName]--;
      this.gameEngine.removeObjectFromWorld(playerWiggle.id);
      if (this.roomTracker[playerWiggle.roomName] === 0) {
        this.destroyRoom(playerWiggle.roomName);
      }
    }
  }

  // THis isn't working properly
  onPlayerRoomUpdate(playerId, from, to) {
    let playerWiggle = this.gameEngine.world.queryObject({ playerId });
    console.log("Player room", playerWiggle.roomName);
    console.log("Player left room", from);
    this.roomTracker[from]--;
    if (this.roomTracker[from] === 0) {
      this.destroyRoom(from);
    }
  }

  // Eating Food:
  // increase body length, and remove the food
  wiggleEatFood(w, f) {
    if (!(f.id in this.gameEngine.world.objects)) return;
    this.gameEngine.removeObjectFromWorld(f);
    w.bodyLength++;
    w.foodEaten++;
    this.addFood(f.roomName);
    // if (f.id % 5 === 0) {
    //   // get scores of wiggles that aren't AI in f.roomName
    //   debounceLeaderboard(leaderboardArray, req, username);
    // }
  }

  async wiggleHitWiggle(w1, w2) {
    // w2 is the winner
    if (!(w2.id in this.gameEngine.world.objects) || !(w1.id in this.gameEngine.world.objects)) return;
    if (w1.destroyed) return;
    w1.destroyed = true; // Handles race condition that happens when multiple body parts get hit

    if (!w1.AI) {
      w2.score++;
      w2.bodyLength += w1.bodyLength / 2; // Blocking other player steals more length
    } else {
      w2.bodyLength += w1.bodyLength / 4;
    }
    // console.log(Object.keys(this.gameEngine.world.objects).length);
    if (!w2.AI && !w1.AI) {
      // if (!w2.AI) {
      // Only update if both in collision are players
      const leaderboardArray = await this.getLeaderboardArray(w2.roomName);
      this.debounceLeaderboard(leaderboardArray, w2.req, w2.name);
    }
    this.wiggleDestroyed(w1);
  }

  wiggleDestroyed(w) {
    if (!(w.id in this.gameEngine.world.objects)) return;
    this.gameEngine.removeObjectFromWorld(w);
    if (w.AI) this.addAI(w.roomName);
  }

  async getLeaderboardArray(roomName) {
    let wiggles = this.gameEngine.world.queryObjects({ instanceType: Wiggle, roomName, AI: false });
    let leaderboardArray = wiggles
      .map((wiggle) => {
        const data = { kills: wiggle.score, name: wiggle.name };
        return { id: wiggle.id, data };
      })
      .sort((a, b) => {
        return a.score - b.score;
      });

    // for (const id in this.connectedPlayers) {
    //   const player = this.connectedPlayers[id];
    //   if (player.roomName === roomName) leaderboardArray.push(player);
    // }
    // console.log(leaderboardArray);

    return leaderboardArray;
  }

  stepLogic() {
    let wiggles = this.gameEngine.world.queryObjects({ instanceType: Wiggle });
    let foodObjects = this.gameEngine.world.queryObjects({ instanceType: Food });

    for (let w of wiggles) {
      // Skip if that room doesn't have anyone in it
      // if (!this.roomTracker[w.roomName] || this.roomTracker[w.roomName] === 0) continue;
      // check for collision
      for (let w2 of wiggles) {
        if (w === w2) continue;

        for (let i = 0; i < w2.bodyParts.length; i++) {
          let distance = w2.bodyParts[i].clone().subtract(w.position);
          if (distance.length() < this.gameEngine.collideDistance) {
            this.wiggleHitWiggle(w, w2);
            continue;
          }
        }
      }

      // check for food-eating
      for (let f of foodObjects) {
        let distance = w.position.clone().subtract(f.position);
        if (distance.length() < this.gameEngine.eatDistance) {
          this.wiggleEatFood(w, f);
        }
      }

      // Slowly (and somewhat randomly) reduce length to prevent just sitting and hiding
      if (Math.random() < 0.02) {
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
