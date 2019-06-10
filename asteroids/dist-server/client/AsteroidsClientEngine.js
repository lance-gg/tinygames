"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lanceGg = require("lance-gg");

var _AsteroidsRenderer = _interopRequireDefault(require("../client/AsteroidsRenderer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var betaTiltThreshold = 40;
var gammaTiltThreshold = 40;
var steerThreshold = 0.4;

var AsteroidsClientEngine =
/*#__PURE__*/
function (_ClientEngine) {
  _inherits(AsteroidsClientEngine, _ClientEngine);

  function AsteroidsClientEngine(gameEngine, options) {
    var _this;

    _classCallCheck(this, AsteroidsClientEngine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AsteroidsClientEngine).call(this, gameEngine, options, _AsteroidsRenderer["default"])); //  Game input

    if (isTouchDevice()) {
      document.querySelector('#instructionsMobile').classList.remove('hidden');
      _this.actions = new Set();
      _this.fireButton = document.querySelector('.fireButton');
      _this.fireButton.style.opacity = 1;
      _this.boostButton = document.querySelector('.boostButton');
      _this.boostButton.style.opacity = 1;
      window.addEventListener('deviceorientation', _this.handleOrientation.bind(_assertThisInitialized(_this)));

      _this.fireButton.addEventListener('touchstart', _this.handleButton.bind(_assertThisInitialized(_this), 'space'), false);

      _this.boostButton.addEventListener('touchstart', _this.handleButton.bind(_assertThisInitialized(_this), 'up'), false);

      _this.gameEngine.on('client__preStep', _this.preStep.bind(_assertThisInitialized(_this)));
    } else {
      document.querySelector('#instructions').classList.remove('hidden');
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
    }

    return _this;
  }

  _createClass(AsteroidsClientEngine, [{
    key: "handleButton",
    value: function handleButton(action, ev) {
      this.actions.add(action);
      ev.preventDefault();
    }
  }, {
    key: "handleOrientation",
    value: function handleOrientation(event) {
      var isPortrait = window.innerHeight > window.innerWidth;
      var beta = event.beta; // In degree in the range [-180,180]

      var gamma = event.gamma; // In degree in the range [-90,90]

      var flip = gamma > 0;
      var steerValue = Math.max(-1, Math.min(1, beta / betaTiltThreshold)) * (flip ? -1 : 1);

      if (isPortrait) {
        flip = beta < 0;
        steerValue = Math.max(-1, Math.min(1, gamma / gammaTiltThreshold)) * (flip ? -1 : 1);
      }

      this.actions["delete"]('left');
      this.actions["delete"]('right');
      if (steerValue < -steerThreshold) this.actions.add('left');else if (steerValue > steerThreshold) this.actions.add('right');
    } // our pre-step is to process inputs that are "currently pressed" during the game step

  }, {
    key: "preStep",
    value: function preStep() {
      var _this2 = this;

      this.actions.forEach(function (action) {
        return _this2.sendInput(action, {
          movement: true
        });
      });
      this.actions = new Set();
    }
  }]);

  return AsteroidsClientEngine;
}(_lanceGg.ClientEngine);

exports["default"] = AsteroidsClientEngine;

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
}
//# sourceMappingURL=AsteroidsClientEngine.js.map