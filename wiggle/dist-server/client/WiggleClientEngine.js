"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

var _WiggleRenderer = _interopRequireDefault(require("../client/WiggleRenderer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var WiggleClientEngine =
/*#__PURE__*/
function (_ClientEngine) {
  _inherits(WiggleClientEngine, _ClientEngine);

  function WiggleClientEngine(gameEngine, options) {
    var _this;

    _classCallCheck(this, WiggleClientEngine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(WiggleClientEngine).call(this, gameEngine, options, _WiggleRenderer.default)); // show try-again button

    gameEngine.on('objectDestroyed', function (obj) {
      if (obj.playerId === gameEngine.playerId) {
        document.body.classList.add('lostGame');
        document.querySelector('#tryAgain').disabled = false;
      }
    }); // restart game

    document.querySelector('#tryAgain').addEventListener('click', function () {
      window.location.reload();
    });
    _this.mouseX = null;
    _this.mouseY = null;
    document.addEventListener('mousemove', _this.updateMouseXY.bind(_assertThisInitialized(_this)), false);
    document.addEventListener('mouseenter', _this.updateMouseXY.bind(_assertThisInitialized(_this)), false);
    document.addEventListener('touchmove', _this.updateMouseXY.bind(_assertThisInitialized(_this)), false);
    document.addEventListener('touchenter', _this.updateMouseXY.bind(_assertThisInitialized(_this)), false);

    _this.gameEngine.on('client__preStep', _this.sendMouseAngle.bind(_assertThisInitialized(_this)));

    return _this;
  }

  _createClass(WiggleClientEngine, [{
    key: "updateMouseXY",
    value: function updateMouseXY(e) {
      e.preventDefault();
      if (e.touches) e = e.touches.item(0);
      this.mouseX = e.pageX;
      this.mouseY = e.pageY;
    }
  }, {
    key: "sendMouseAngle",
    value: function sendMouseAngle() {
      var player = this.gameEngine.world.queryObject({
        playerId: this.gameEngine.playerId
      });
      if (this.mouseY === null || player === null) return;
      var mouseX = (this.mouseX - document.body.clientWidth / 2) / this.zoom;
      var mouseY = (this.mouseY - document.body.clientHeight / 2) / this.zoom;
      var dx = mouseY - player.position.y;
      var dy = mouseX - player.position.x;

      if (Math.sqrt(dx * dx + dy * dy) < 0.5) {
        this.sendInput(this.gameEngine.directionStop, {
          movement: true
        });
        return;
      }

      var angle = Math.atan2(dx, dy);
      this.sendInput(angle, {
        movement: true
      });
    }
  }]);

  return WiggleClientEngine;
}(_lanceGg.ClientEngine);

exports.default = WiggleClientEngine;
//# sourceMappingURL=WiggleClientEngine.js.map