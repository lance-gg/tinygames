"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lanceGg = require("lance-gg");

var _Asteroid = _interopRequireDefault(require("./../common/Asteroid"));

var _Bullet = _interopRequireDefault(require("./../common/Bullet"));

var _Ship = _interopRequireDefault(require("./../common/Ship"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ctx = null;
var game = null;
var canvas = null;

var AsteroidsRenderer =
/*#__PURE__*/
function (_Renderer) {
  _inherits(AsteroidsRenderer, _Renderer);

  function AsteroidsRenderer(gameEngine, clientEngine) {
    var _this;

    _classCallCheck(this, AsteroidsRenderer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AsteroidsRenderer).call(this, gameEngine, clientEngine));
    game = gameEngine; // Init canvas

    canvas = document.createElement('canvas');
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    document.body.insertBefore(canvas, document.getElementById('logo'));
    game.w = canvas.width;
    game.h = canvas.height;
    game.zoom = game.h / game.spaceHeight;
    if (game.w / game.spaceWidth < game.zoom) game.zoom = game.w / game.spaceWidth;
    ctx = canvas.getContext('2d');
    ctx.lineWidth = 2 / game.zoom;
    ctx.strokeStyle = ctx.fillStyle = 'white'; // remove instructions on first input

    setTimeout(_this.removeInstructions.bind(_assertThisInitialized(_this)), 5000);
    return _this;
  }

  _createClass(AsteroidsRenderer, [{
    key: "draw",
    value: function draw(t, dt) {
      var _this2 = this;

      _get(_getPrototypeOf(AsteroidsRenderer.prototype), "draw", this).call(this, t, dt); // Clear the canvas


      ctx.clearRect(0, 0, game.w, game.h); // Transform the canvas
      // Note that we need to flip the y axis since Canvas pixel coordinates
      // goes from top to bottom, while physics does the opposite.

      ctx.save();
      ctx.translate(game.w / 2, game.h / 2); // Translate to the center

      ctx.scale(game.zoom, -game.zoom); // Zoom in and flip y axis
      // Draw all things

      this.drawBounds();
      game.world.forEachObject(function (id, obj) {
        if (obj instanceof _Ship["default"]) _this2.drawShip(obj.physicsObj);else if (obj instanceof _Bullet["default"]) _this2.drawBullet(obj.physicsObj);else if (obj instanceof _Asteroid["default"]) _this2.drawAsteroid(obj.physicsObj);
      }); // update status and restore

      this.updateStatus();
      ctx.restore();
    }
  }, {
    key: "updateStatus",
    value: function updateStatus() {
      var playerShip = this.gameEngine.world.queryObject({
        playerId: this.gameEngine.playerId
      });

      if (!playerShip) {
        if (this.lives !== undefined) document.getElementById('gameover').classList.remove('hidden');
        return;
      } // update lives if necessary


      if (playerShip.playerId === this.gameEngine.playerId && this.lives !== playerShip.lives) {
        document.getElementById('lives').innerHTML = 'Lives ' + playerShip.lives;
        this.lives = playerShip.lives;
      }
    }
  }, {
    key: "removeInstructions",
    value: function removeInstructions() {
      document.getElementById('instructions').classList.add('hidden');
      document.getElementById('instructionsMobile').classList.add('hidden');
    }
  }, {
    key: "drawShip",
    value: function drawShip(body) {
      var radius = body.shapes[0].radius;
      ctx.save();
      ctx.translate(body.position[0], body.position[1]); // Translate to the ship center

      ctx.rotate(body.angle); // Rotate to ship orientation

      ctx.beginPath();
      ctx.moveTo(-radius * 0.6, -radius);
      ctx.lineTo(0, radius);
      ctx.lineTo(radius * 0.6, -radius);
      ctx.moveTo(-radius * 0.5, -radius * 0.5);
      ctx.lineTo(radius * 0.5, -radius * 0.5);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  }, {
    key: "drawAsteroid",
    value: function drawAsteroid(body) {
      ctx.save();
      ctx.translate(body.position[0], body.position[1]); // Translate to the center

      ctx.rotate(body.angle);
      ctx.beginPath();

      for (var j = 0; j < game.numAsteroidVerts; j++) {
        var xv = body.verts[j][0];
        var yv = body.verts[j][1];
        if (j == 0) ctx.moveTo(xv, yv);else ctx.lineTo(xv, yv);
      }

      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  }, {
    key: "drawBullet",
    value: function drawBullet(body) {
      ctx.beginPath();
      ctx.arc(body.position[0], body.position[1], game.bulletRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    }
  }, {
    key: "drawBounds",
    value: function drawBounds() {
      ctx.beginPath();
      ctx.moveTo(-game.spaceWidth / 2, -game.spaceHeight / 2);
      ctx.lineTo(-game.spaceWidth / 2, game.spaceHeight / 2);
      ctx.lineTo(game.spaceWidth / 2, game.spaceHeight / 2);
      ctx.lineTo(game.spaceWidth / 2, -game.spaceHeight / 2);
      ctx.lineTo(-game.spaceWidth / 2, -game.spaceHeight / 2);
      ctx.closePath();
      ctx.stroke();
    }
  }]);

  return AsteroidsRenderer;
}(_lanceGg.Renderer);

exports["default"] = AsteroidsRenderer;
//# sourceMappingURL=AsteroidsRenderer.js.map