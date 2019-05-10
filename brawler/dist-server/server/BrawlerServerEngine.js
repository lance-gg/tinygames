"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

var _Fighter = _interopRequireDefault(require("../common/Fighter"));

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

var game = null;

var BrawlerServerEngine =
/*#__PURE__*/
function (_ServerEngine) {
  _inherits(BrawlerServerEngine, _ServerEngine);

  function BrawlerServerEngine(io, gameEngine, inputOptions) {
    var _this;

    _classCallCheck(this, BrawlerServerEngine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BrawlerServerEngine).call(this, io, gameEngine, inputOptions));
    game = gameEngine;
    game.on('postStep', _this.postStep.bind(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(BrawlerServerEngine, [{
    key: "start",
    value: function start() {
      _get(_getPrototypeOf(BrawlerServerEngine.prototype), "start", this).call(this); // add floor


      game.addPlatform({
        x: 0,
        y: 0,
        width: game.platformUnit * 20
      }); // add platforms

      game.addPlatform({
        x: 10,
        y: 20,
        width: game.platformUnit * 3
      });
      game.addPlatform({
        x: 50,
        y: 30,
        width: game.platformUnit * 3
      });
      game.addPlatform({
        x: 90,
        y: 30,
        width: game.platformUnit * 3
      });
      game.addPlatform({
        x: 130,
        y: 20,
        width: game.platformUnit * 3
      }); // add dinos

      for (var i = 0; i < game.dinoCount; i++) {
        var f = game.addFighter(0);
        f.isDino = true;
        f.direction = 1;
      }
    } // check if fighter f1 killed f2

  }, {
    key: "checkKills",
    value: function checkKills(f1, f2) {
      // if f2 is already dying, exit
      if (f1 === f2 || f2.action === _Fighter.default.ACTIONS.indexOf('DIE')) return; // kill distance is different for fighters and dino's

      var killDistance = null;
      if (f1.action === _Fighter.default.ACTIONS.indexOf('FIGHT')) killDistance = game.killDistance;else if (f1.isDino && !f2.isDino) killDistance = game.dinoKillDistance;
      if (killDistance === null) return;
      var dx = Math.abs(f1.position.x - f2.position.x);
      var dy = Math.abs(f1.position.y - f2.position.y);

      if (dx <= killDistance && dy <= killDistance) {
        f1.kills++;
        f2.action = _Fighter.default.ACTIONS.indexOf('DIE');
        f2.progress = 100;
      }
    } // handle Dino state change

  }, {
    key: "updateDinoAction",
    value: function updateDinoAction(f1) {
      // Dinos keep walking
      if (f1.action === _Fighter.default.ACTIONS.indexOf('RUN')) f1.position.x += game.walkSpeed * f1.direction; // end-of-action handling

      if (f1.progress === 0) {
        f1.progress = 100; // end of dying sequence

        if (f1.action === _Fighter.default.ACTIONS.indexOf('DIE')) {
          // Dino fighters come back to life
          if (f1.isDino) {
            var f = game.addFighter(0);
            f.isDino = true;
            f.direction = 1;
          }

          game.removeObjectFromWorld(f1);
          return;
        } // choose direction and action


        if (Math.random() > 0.7) f1.direction *= -1;
        var nextAction = Math.floor(_Fighter.default.ACTIONS.length * Math.random());
        if (nextAction !== _Fighter.default.ACTIONS.indexOf('DIE') && nextAction !== _Fighter.default.ACTIONS.indexOf('FIGHT')) f1.action = nextAction;
        if (nextAction === _Fighter.default.ACTIONS.indexOf('JUMP') && f1.velocity.length() === 0) f1.velocity.y = game.jumpSpeed;
      }
    } // handle fighter state change

  }, {
    key: "updateFighterAction",
    value: function updateFighterAction(f1) {
      // if no input applied and we were running, switch to idle
      var inputApplied = game.inputsApplied.indexOf(f1.playerId) >= 0;
      if (!inputApplied && f1.action === _Fighter.default.ACTIONS.indexOf('RUN')) f1.action = _Fighter.default.ACTIONS.indexOf('IDLE'); // end-of-action handling

      if (f1.progress === 0) {
        f1.progress = 100; // end of dying sequence

        if (f1.action === _Fighter.default.ACTIONS.indexOf('DIE')) {
          game.removeObjectFromWorld(f1);
          return;
        } // if no input applied on this turn, switch to idle


        if (!inputApplied) f1.action = _Fighter.default.ACTIONS.indexOf('IDLE');
      }
    } // post-step state transitions

  }, {
    key: "postStep",
    value: function postStep() {
      var fighters = game.world.queryObjects({
        instanceType: _Fighter.default
      });
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = fighters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var f1 = _step.value;
          // updates to action
          if (f1.isDino) this.updateDinoAction(f1);else this.updateFighterAction(f1); // check world bounds

          f1.position.x = Math.max(f1.position.x, 0);
          f1.position.x = Math.min(f1.position.x, game.spaceWidth - game.fighterWidth); // check for kills

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = fighters[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var f2 = _step2.value;
              this.checkKills(f1, f2);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        } // reset input list

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

      game.inputsApplied = [];
    }
  }, {
    key: "onPlayerConnected",
    value: function onPlayerConnected(socket) {
      _get(_getPrototypeOf(BrawlerServerEngine.prototype), "onPlayerConnected", this).call(this, socket);

      game.addFighter(socket.playerId);
    }
  }, {
    key: "onPlayerDisconnected",
    value: function onPlayerDisconnected(socketId, playerId) {
      _get(_getPrototypeOf(BrawlerServerEngine.prototype), "onPlayerDisconnected", this).call(this, socketId, playerId);

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = game.world.queryObjects({
          playerId: playerId
        })[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var o = _step3.value;
          game.removeObjectFromWorld(o.id);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }]);

  return BrawlerServerEngine;
}(_lanceGg.ServerEngine);

exports.default = BrawlerServerEngine;
//# sourceMappingURL=BrawlerServerEngine.js.map