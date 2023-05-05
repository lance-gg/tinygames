import { ClientEngine } from "@rtsdk/lance-topia";
import WiggleRenderer from "../client/WiggleRenderer";

export default class WiggleClientEngine extends ClientEngine {
  constructor(gameEngine, options) {
    super(gameEngine, options, WiggleRenderer);

    // show try-again button
    gameEngine.on("objectDestroyed", (obj) => {
      if (obj.playerId === gameEngine.playerId) {
        document.body.classList.add("lostGame");
        document.querySelector("#tryAgain").disabled = false;
      }
    });

    // restart game
    document.querySelector("#tryAgain").addEventListener("click", () => {
      window.location.reload();
    });

    this.mouseX = null;
    this.mouseY = null;

    document.addEventListener("mousemove", this.updateMouseXY.bind(this), false);
    document.addEventListener("mouseenter", this.updateMouseXY.bind(this), false);
    document.addEventListener("touchmove", this.updateMouseXY.bind(this), false);
    document.addEventListener("touchenter", this.updateMouseXY.bind(this), false);
    this.gameEngine.on("client__preStep", this.sendMouseAngle.bind(this));
  }

  updateMouseXY(e) {
    e.preventDefault();
    if (e.touches) e = e.touches.item(0);
    this.mouseX = e.pageX;
    this.mouseY = e.pageY;
  }

  sendMouseAngle() {
    let player = this.gameEngine.world.queryObject({ playerId: this.gameEngine.playerId });
    if (this.mouseY === null || player === null) return;

    let mouseX = (this.mouseX - document.body.clientWidth / 2) / this.zoom;
    let mouseY = (this.mouseY - document.body.clientHeight / 2) / this.zoom;
    let dx = mouseY - player.position.y;
    let dy = mouseX - player.position.x;
    if (Math.sqrt(dx * dx + dy * dy) < 0.5) {
      this.sendInput(this.gameEngine.directionStop, { movement: true });
      return;
    }

    let angle = Math.atan2(dx, dy);
    this.sendInput(angle, { movement: true });
  }

  connect() {
    return super.connect().then(() => {
      this.socket.on("spectating", () => {
        console.log("spectating");
        document.querySelector("#spectating").className = "showOpaque";
        // document.querySelector("#joinGame").innerHTML = "Spectating";
      });

      this.socket.on("notinroom", () => {
        console.log("notinroom");
        // document.querySelector("#introText").innerHTML = "You can only enter a game from within a world";
        // document.querySelector("#joinGame").innerHTML =
        // "<a href=https://github.com/metaversecloud-com/multiplayer-iframe-game-example>Find me on GitHub</a>";
      });

      this.socket.on("inzone", () => {
        console.log("inzone");
        document.querySelector("#spectating").className = "hidden";
        // document.querySelector("#introText").innerHTML = "You are in the Game Zone. Click Join Game to play";
        // document.querySelector("#joinGame").innerHTML = "Join Game";
      });

      this.socket.on("isadmin", () => {
        console.log("Heard is admin");
        function appendHtml(el, str) {
          var div = document.createElement("button"); //container to append to
          div.innerHTML = str;
          while (div.children.length > 0) {
            el.appendChild(div.children[0]);
          }
        }
        appendHtml(
          document.querySelector("#adminControls"),
          "<button id='showLeaderboard' class='adminButton'>Show Scores</button>",
        );
        appendHtml(
          document.querySelector("#adminControls"),
          "<button id='hideLeaderboard' class='adminButton'>Hide Scores</button>",
        );
        // appendHtml(
        //   document.querySelector("#adminControls"),
        //   "<button id='resetLeaderboard'>Reset Leaderboard</button>",
        // );

        setTimeout(() => {
          document.querySelector("#showLeaderboard").addEventListener("click", (clickEvent) => {
            this.socket.emit("showLeaderboard");
          });
          document.querySelector("#hideLeaderboard").addEventListener("click", (clickEvent) => {
            this.socket.emit("hideLeaderboard");
          });
          //   document.querySelector("#resetLeaderboard").addEventListener("click", (clickEvent) => {
          //     this.socket.emit("resetLeaderboard");
          //   });
        }, 250);
      });

      this.socket.on("error", () => {
        console.log("error");
        document.querySelector("#introText").innerHTML = "There was an error loading the game.  Please try reloading";
        document.querySelector("#joinGame").innerHTML = "<a href=.>Reload</a>";
      });

      //   this.socket.on("scoreUpdate", (e) => {
      //     const params = new Proxy(new URLSearchParams(window.location.search), {
      //       get: (searchParams, prop) => searchParams.get(prop),
      //     });
      //     let value = params[VisitorInfo.roomBasedOn];
      //     this.renderer.updateScore(e[value]);

      //     let scoreArray = [];
      //     for (let id of Object.keys(e[value])) {
      //       scoreArray.push({
      //         id,
      //         data: e[value][id],
      //       });
      //     }
      //     scoreArray.sort((a, b) => {
      //       return b.data.kills - a.data.kills;
      //     });

      //     // Only send update if you're in the lead
      //     if (
      //       this.renderer.playerShip &&
      //       scoreArray.length &&
      //       this.renderer.playerShip.id == parseInt(scoreArray[0].id)
      //     ) {
      //       this.socket.emit("updateLeaderboard", scoreArray);
      //     }
      //   });

      this.socket.on("disconnect", (e) => {
        console.log("disconnected");
        document.body.classList.add("disconnected");
        document.body.classList.remove("gameActive");
        // document.querySelector("#reconnect").disabled = false;
      });

      //   if ("autostart" in Utils.getUrlVars()) {
      //     this.socket.emit("requestRestart");
      //   }
    });
  }
}
