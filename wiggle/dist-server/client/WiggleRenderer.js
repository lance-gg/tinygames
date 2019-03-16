"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

var _Wiggle = _interopRequireDefault(require("../common/Wiggle"));

var _Food = _interopRequireDefault(require("../common/Food"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var canvas = null;
var game = null;
var c = 0;

var WiggleRenderer =
/*#__PURE__*/
function (_Renderer) {
  _inherits(WiggleRenderer, _Renderer);

  function WiggleRenderer(gameEngine, clientEngine) {
    var _this;

    _classCallCheck(this, WiggleRenderer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(WiggleRenderer).call(this, gameEngine, clientEngine));
    game = gameEngine;
    canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.insertBefore(canvas, document.getElementById('logo'));
    game.w = canvas.width;
    game.h = canvas.height;
    clientEngine.zoom = game.h / game.spaceHeight;
    if (game.w / game.spaceWidth < clientEngine.zoom) clientEngine.zoom = game.w / game.spaceWidth;
    ctx = canvas.getContext('2d');
    ctx.lineWidth = 2 / clientEngine.zoom;
    ctx.strokeStyle = ctx.fillStyle = 'white';
    return _this;
  }

  _createClass(WiggleRenderer, [{
    key: "draw",
    value: function draw(t, dt) {
      var _this2 = this;

      _get(_getPrototypeOf(WiggleRenderer.prototype), "draw", this).call(this, t, dt); // Clear the canvas


      ctx.clearRect(0, 0, game.w, game.h); // Transform the canvas
      // Note that we need to flip the y axis since Canvas pixel coordinates
      // goes from top to bottom, while physics does the opposite.

      ctx.save();
      ctx.translate(game.w / 2, game.h / 2); // Translate to the center

      ctx.scale(this.clientEngine.zoom, this.clientEngine.zoom); // Zoom in and flip y axis
      // Draw all things

      game.world.forEachObject(function (id, obj) {
        if (obj instanceof _Wiggle.default) _this2.drawWiggle(obj);else if (obj instanceof _Food.default) _this2.drawFood(obj);
      });
      ctx.restore();
    }
  }, {
    key: "rainbowColors",
    value: function rainbowColors() {
      c += 0.005;
      var zeroTo240 = Math.floor((Math.cos(c) + 1) * 120);
      return "rgb(".concat(zeroTo240, ",100,200)");
    }
  }, {
    key: "drawWiggle",
    value: function drawWiggle(w) {
      // draw head and body
      var isPlayer = w.playerId === this.gameEngine.playerId;
      var x = w.position.x;
      var y = w.position.y;
      if (isPlayer) ctx.fillStyle = this.rainbowColors();
      this.drawCircle(x, y, game.headRadius, true);

      for (var i = 0; i < w.bodyParts.length; i++) {
        var nextPos = w.bodyParts[i];
        if (isPlayer) ctx.fillStyle = this.rainbowColors();
        this.drawCircle(nextPos.x, nextPos.y, game.bodyRadius, true);
      } // draw eyes


      var angle = +w.direction;

      if (w.direction === game.directionStop) {
        angle = -Math.PI / 2;
      }

      var eye1 = new _lanceGg.TwoVector(Math.cos(angle + game.eyeAngle), Math.sin(angle + game.eyeAngle));
      var eye2 = new _lanceGg.TwoVector(Math.cos(angle - game.eyeAngle), Math.sin(angle - game.eyeAngle));
      eye1.multiplyScalar(game.eyeDist).add(w.position);
      eye2.multiplyScalar(game.eyeDist).add(w.position);
      ctx.fillStyle = 'black';
      this.drawCircle(eye1.x, eye1.y, game.eyeRadius, true);
      this.drawCircle(eye2.x, eye2.y, game.eyeRadius, true);
      ctx.fillStyle = 'white'; // update status

      if (isPlayer) {
        document.getElementById('wiggle-length').innerHTML = 'Wiggle Length: ' + w.bodyParts.length;
      }
    }
  }, {
    key: "drawFood",
    value: function drawFood(f) {
      ctx.strokeStyle = ctx.fillStyle = 'Orange';
      this.drawCircle(f.position.x, f.position.y, game.foodRadius, true);
      ctx.strokeStyle = ctx.fillStyle = 'White';
    }
  }, {
    key: "drawCircle",
    value: function drawCircle(x, y, radius, fill) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      fill ? ctx.fill() : ctx.stroke();
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

  return WiggleRenderer;
}(_lanceGg.Renderer);

exports.default = WiggleRenderer;
//# sourceMappingURL=WiggleRenderer.js.map