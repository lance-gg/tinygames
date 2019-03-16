"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

var _Wiggle = _interopRequireDefault(require("./Wiggle"));

var _Food = _interopRequireDefault(require("./Food"));

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

var WiggleGameEngine =
/*#__PURE__*/
function (_GameEngine) {
  _inherits(WiggleGameEngine, _GameEngine);

  function WiggleGameEngine(options) {
    var _this;

    _classCallCheck(this, WiggleGameEngine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(WiggleGameEngine).call(this, options));
    _this.physicsEngine = new _lanceGg.SimplePhysicsEngine({
      gameEngine: _assertThisInitialized(_this),
      collisions: {
        autoResolve: false
      }
    });

    _this.on('preStep', _this.moveAll.bind(_assertThisInitialized(_this))); // game variables


    Object.assign(_assertThisInitialized(_this), {
      foodRadius: 0.1,
      headRadius: 0.15,
      bodyRadius: 0.1,
      eyeDist: 0.08,
      eyeRadius: 0.03,
      eyeAngle: 0.5,
      spaceWidth: 16,
      spaceHeight: 9,
      moveDist: 0.06,
      foodCount: 16,
      eatDistance: 0.3,
      collideDistance: 0.3,
      startBodyLength: 10,
      aiCount: 3,
      directionStop: 100
    });
    return _this;
  }

  _createClass(WiggleGameEngine, [{
    key: "registerClasses",
    value: function registerClasses(serializer) {
      serializer.registerClass(_Wiggle.default);
      serializer.registerClass(_Food.default);
    }
  }, {
    key: "start",
    value: function start() {
      _get(_getPrototypeOf(WiggleGameEngine.prototype), "start", this).call(this);
    }
  }, {
    key: "randPos",
    value: function randPos() {
      var x = (Math.random() - 0.5) * this.spaceWidth;
      var y = (Math.random() - 0.5) * this.spaceHeight;
      return new _lanceGg.TwoVector(x, y);
    }
  }, {
    key: "moveAll",
    value: function moveAll(stepInfo) {
      var _this2 = this;

      if (stepInfo.isReenact) return;
      this.world.forEachObject(function (id, obj) {
        if (obj instanceof _Wiggle.default) {
          // if the position changed, add a body part and trim the length
          var pos = obj.position.clone();

          if (obj.bodyParts.length === 0 || pos.subtract(obj.bodyParts[obj.bodyParts.length - 1]).length() > 0.05) {
            obj.bodyParts.push(obj.position.clone());

            while (obj.bodyLength < obj.bodyParts.length) {
              obj.bodyParts.shift();
            }
          } // if not stopped, move along


          if (obj.direction === _this2.directionStop) return;
          var move = new _lanceGg.TwoVector(Math.cos(obj.direction), Math.sin(obj.direction));
          move.multiplyScalar(0.05);
          obj.position.add(move);
          obj.position.y = Math.min(obj.position.y, _this2.spaceHeight / 2);
          obj.position.y = Math.max(obj.position.y, -_this2.spaceHeight / 2);
          obj.position.x = Math.min(obj.position.x, _this2.spaceWidth / 2);
          obj.position.x = Math.max(obj.position.x, -_this2.spaceWidth / 2);
        }
      });
    }
  }, {
    key: "processInput",
    value: function processInput(inputData, playerId) {
      _get(_getPrototypeOf(WiggleGameEngine.prototype), "processInput", this).call(this, inputData, playerId); // get the player's primary object


      var player = this.world.queryObject({
        playerId: playerId
      });

      if (player) {
        player.direction = inputData.input;
      }
    }
  }]);

  return WiggleGameEngine;
}(_lanceGg.GameEngine);

exports.default = WiggleGameEngine;
//# sourceMappingURL=WiggleGameEngine.js.map