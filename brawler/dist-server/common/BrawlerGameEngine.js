"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

var _Fighter = _interopRequireDefault(require("./Fighter"));

var _Platform = _interopRequireDefault(require("./Platform"));

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

var BrawlerGameEngine =
/*#__PURE__*/
function (_GameEngine) {
  _inherits(BrawlerGameEngine, _GameEngine);

  function BrawlerGameEngine(options) {
    var _this;

    _classCallCheck(this, BrawlerGameEngine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BrawlerGameEngine).call(this, options)); // game variables

    Object.assign(_assertThisInitialized(_this), {
      dinoCount: 2,
      spaceWidth: 160,
      spaceHeight: 90,
      fighterWidth: 7,
      fighterHeight: 12,
      jumpSpeed: 1.5,
      walkSpeed: 0.6,
      killDistance: 18,
      dinoKillDistance: 12,
      platformUnit: 8,
      platformHeight: 5
    });
    _this.physicsEngine = new _lanceGg.SimplePhysicsEngine({
      gravity: new _lanceGg.TwoVector(0, -0.05),
      collisions: {
        type: 'bruteForce',
        autoResolve: true
      },
      gameEngine: _assertThisInitialized(_this)
    });
    _this.inputsApplied = [];

    _this.on('preStep', _this.moveAll.bind(_assertThisInitialized(_this)));

    return _this;
  }

  _createClass(BrawlerGameEngine, [{
    key: "registerClasses",
    value: function registerClasses(serializer) {
      serializer.registerClass(_Platform.default);
      serializer.registerClass(_Fighter.default);
    }
  }, {
    key: "processInput",
    value: function processInput(inputData, playerId) {
      _get(_getPrototypeOf(BrawlerGameEngine.prototype), "processInput", this).call(this, inputData, playerId); // handle keyboard presses:
      // right, left - set direction and move fighter in that direction.
      // up          - start jump sequence
      // space       - start the fight sequence


      var fighter = this.world.queryObject({
        playerId: playerId,
        instanceType: _Fighter.default
      });

      if (fighter) {
        // if fighter is dying or fighting, ignore actions
        if (fighter.action === _Fighter.default.ACTIONS.indexOf('DIE') || fighter.action === _Fighter.default.ACTIONS.indexOf('FIGHT')) return;
        var nextAction = null;

        if (inputData.input === 'right') {
          fighter.position.x += this.walkSpeed;
          fighter.direction = 1;
          nextAction = _Fighter.default.ACTIONS.indexOf('RUN');
        } else if (inputData.input === 'left') {
          fighter.position.x -= this.walkSpeed;
          fighter.direction = -1;
          nextAction = _Fighter.default.ACTIONS.indexOf('RUN');
        } else if (inputData.input === 'up') {
          if (fighter.velocity.length() === 0) fighter.velocity.y = this.jumpSpeed;
          nextAction = _Fighter.default.ACTIONS.indexOf('JUMP');
        } else if (inputData.input === 'space') {
          nextAction = _Fighter.default.ACTIONS.indexOf('FIGHT');
        } else {
          nextAction = _Fighter.default.ACTIONS.indexOf('IDLE');
        }

        if (fighter.action !== nextAction) fighter.progress = 99;
        fighter.action = nextAction;
        fighter.refreshToPhysics(); // remember that an input was applied on this turn

        this.inputsApplied.push(playerId);
      }
    } // logic for every game step

  }, {
    key: "moveAll",
    value: function moveAll(stepInfo) {
      if (stepInfo.isReenact) return; // advance animation progress for all fighters

      var fighters = this.world.queryObjects({
        instanceType: _Fighter.default
      }); // update action progress

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = fighters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var f1 = _step.value;
          f1.progress -= 6;
          if (f1.progress < 0) f1.progress = 0;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    } // create fighter

  }, {
    key: "addFighter",
    value: function addFighter(playerId) {
      var f = new _Fighter.default(this, null, {
        playerId: playerId,
        position: this.randomPosition()
      });
      f.height = this.fighterHeight;
      f.width = this.fighterWidth;
      f.direction = 1;
      f.progress = 0;
      f.action = 0;
      f.kills = 0;
      this.addObjectToWorld(f);
      return f;
    } // create a platform

  }, {
    key: "addPlatform",
    value: function addPlatform(desc) {
      var p = new _Platform.default(this, null, {
        playerId: 0,
        position: new _lanceGg.TwoVector(desc.x, desc.y)
      });
      p.width = desc.width;
      p.height = this.platformHeight;
      p.isStatic = 1;
      this.addObjectToWorld(p);
      return p;
    } // random position for new object

  }, {
    key: "randomPosition",
    value: function randomPosition() {
      return new _lanceGg.TwoVector(this.spaceWidth / 4 + Math.random() * this.spaceWidth / 2, 70);
    }
  }]);

  return BrawlerGameEngine;
}(_lanceGg.GameEngine);

exports.default = BrawlerGameEngine;
//# sourceMappingURL=BrawlerGameEngine.js.map