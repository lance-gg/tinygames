"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

var _BrawlerRenderer = _interopRequireDefault(require("../client/BrawlerRenderer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BrawlerClientEngine =
/*#__PURE__*/
function (_ClientEngine) {
  _inherits(BrawlerClientEngine, _ClientEngine);

  function BrawlerClientEngine(gameEngine, options) {
    var _this;

    _classCallCheck(this, BrawlerClientEngine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BrawlerClientEngine).call(this, gameEngine, options, _BrawlerRenderer.default)); // show try-again button

    gameEngine.on('objectDestroyed', function (obj) {
      if (obj.playerId === gameEngine.playerId) {
        document.body.classList.add('lostGame');
        document.querySelector('#tryAgain').disabled = false;
      }
    }); // remove instructions

    setTimeout(function () {
      document.querySelector('#instructions').classList.add('hidden');
    }, 5000); // restart game

    document.querySelector('#tryAgain').addEventListener('click', function () {
      window.location.reload();
    });
    _this.controls = new _lanceGg.KeyboardControls(_assertThisInitialized(_this));

    _this.controls.bindKey('up', 'up', {
      repeat: true
    });

    _this.controls.bindKey('down', 'down', {
      repeat: true
    });

    _this.controls.bindKey('left', 'left', {
      repeat: true
    });

    _this.controls.bindKey('right', 'right', {
      repeat: true
    });

    _this.controls.bindKey('space', 'space');

    return _this;
  }

  return BrawlerClientEngine;
}(_lanceGg.ClientEngine);

exports.default = BrawlerClientEngine;
//# sourceMappingURL=BrawlerClientEngine.js.map