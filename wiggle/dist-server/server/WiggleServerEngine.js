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

var WiggleServerEngine =
/*#__PURE__*/
function (_ServerEngine) {
  _inherits(WiggleServerEngine, _ServerEngine);

  function WiggleServerEngine(io, gameEngine, inputOptions) {
    var _this;

    _classCallCheck(this, WiggleServerEngine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(WiggleServerEngine).call(this, io, gameEngine, inputOptions));

    _this.gameEngine.on('postStep', _this.stepLogic.bind(_assertThisInitialized(_this)));

    return _this;
  } // create food and AI robots


  _createClass(WiggleServerEngine, [{
    key: "start",
    value: function start() {
      _get(_getPrototypeOf(WiggleServerEngine.prototype), "start", this).call(this);

      for (var f = 0; f < this.gameEngine.foodCount; f++) {
        var newF = new _Food.default(this.gameEngine, null, {
          position: this.gameEngine.randPos()
        });
        this.gameEngine.addObjectToWorld(newF);
      }

      for (var ai = 0; ai < this.gameEngine.aiCount; ai++) {
        this.addAI();
      }
    }
  }, {
    key: "addAI",
    value: function addAI() {
      var newAI = new _Wiggle.default(this.gameEngine, null, {
        position: this.gameEngine.randPos()
      });
      newAI.AI = true;
      newAI.direction = 0;
      newAI.turnDirection = 1;
      newAI.bodyLength = this.gameEngine.startBodyLength;
      newAI.playerId = 0;
      this.gameEngine.addObjectToWorld(newAI);
    }
  }, {
    key: "onPlayerConnected",
    value: function onPlayerConnected(socket) {
      _get(_getPrototypeOf(WiggleServerEngine.prototype), "onPlayerConnected", this).call(this, socket);

      var player = new _Wiggle.default(this.gameEngine, null, {
        position: this.gameEngine.randPos()
      });
      player.direction = 0;
      player.bodyLength = this.gameEngine.startBodyLength;
      player.playerId = socket.playerId;
      this.gameEngine.addObjectToWorld(player);
    }
  }, {
    key: "onPlayerDisconnected",
    value: function onPlayerDisconnected(socketId, playerId) {
      _get(_getPrototypeOf(WiggleServerEngine.prototype), "onPlayerDisconnected", this).call(this, socketId, playerId);

      var playerWiggle = this.gameEngine.world.queryObject({
        playerId: playerId
      });
      if (playerWiggle) this.gameEngine.removeObjectFromWorld(playerWiggle.id);
    } // Eating Food:
    // increase body length, and remove the food

  }, {
    key: "wiggleEatFood",
    value: function wiggleEatFood(w, f) {
      if (!(f.id in this.gameEngine.world.objects)) return;
      w.bodyLength++;
      this.gameEngine.removeObjectFromWorld(f);
      var newF = new _Food.default(this.gameEngine, null, {
        position: this.gameEngine.randPos()
      });
      this.gameEngine.addObjectToWorld(newF);
    }
  }, {
    key: "wiggleHitWiggle",
    value: function wiggleHitWiggle(w1, w2) {
      if (!(w2.id in this.gameEngine.world.objects) || !(w1.id in this.gameEngine.world.objects)) return;
      this.gameEngine.removeObjectFromWorld(w1);
      if (w1.AI) this.addAI();
    }
  }, {
    key: "stepLogic",
    value: function stepLogic() {
      var wiggles = this.gameEngine.world.queryObjects({
        instanceType: _Wiggle.default
      });
      var foodObjects = this.gameEngine.world.queryObjects({
        instanceType: _Food.default
      });
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = wiggles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var w = _step.value;
          // check for collision
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = wiggles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var w2 = _step2.value;
              if (w === w2) continue;

              for (var i = 0; i < w2.bodyParts.length; i++) {
                var distance = w2.bodyParts[i].clone().subtract(w.position);
                if (distance.length() < this.gameEngine.collideDistance) this.wiggleHitWiggle(w, w2);
              }
            } // check for food-eating

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

          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = foodObjects[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var f = _step3.value;

              var _distance = w.position.clone().subtract(f.position);

              if (_distance.length() < this.gameEngine.eatDistance) {
                this.wiggleEatFood(w, f);
              }
            } // move AI wiggles

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

          if (w.AI) {
            if (Math.random() < 0.01) w.turnDirection *= -1;
            w.direction += w.turnDirection * (Math.random() - 0.9) / 20;
            if (w.position.y >= this.gameEngine.spaceHeight / 2) w.direction = -Math.PI / 2;
            if (w.position.y <= -this.gameEngine.spaceHeight / 2) w.direction = Math.PI / 2;
            if (w.position.x >= this.gameEngine.spaceWidth / 2) w.direction = Math.PI;
            if (w.position.x <= -this.gameEngine.spaceWidth / 2) w.direction = 0;
            if (w.direction > Math.PI * 2) w.direction -= Math.PI * 2;
            if (w.direction < 0) w.direction += Math.PI * 2;
          }
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
    }
  }]);

  return WiggleServerEngine;
}(_lanceGg.ServerEngine);

exports.default = WiggleServerEngine;
//# sourceMappingURL=WiggleServerEngine.js.map