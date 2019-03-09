"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

var _Asteroid = _interopRequireDefault(require("../common/Asteroid"));

var _Bullet = _interopRequireDefault(require("../common/Bullet"));

var _Ship = _interopRequireDefault(require("../common/Ship"));

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

var AsteroidsServerEngine =
/*#__PURE__*/
function (_ServerEngine) {
  _inherits(AsteroidsServerEngine, _ServerEngine);

  function AsteroidsServerEngine(io, gameEngine, inputOptions) {
    var _this;

    _classCallCheck(this, AsteroidsServerEngine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AsteroidsServerEngine).call(this, io, gameEngine, inputOptions));
    gameEngine.physicsEngine.world.on('beginContact', _this.handleCollision.bind(_assertThisInitialized(_this)));
    gameEngine.on('shoot', _this.shoot.bind(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(AsteroidsServerEngine, [{
    key: "start",
    value: function start() {
      _get(_getPrototypeOf(AsteroidsServerEngine.prototype), "start", this).call(this);

      this.gameEngine.addAsteroids();
    } // handle a collision on server only

  }, {
    key: "handleCollision",
    value: function handleCollision(evt) {
      // identify the two objects which collided
      var A;
      var B;
      this.gameEngine.world.forEachObject(function (id, obj) {
        if (obj.physicsObj === evt.bodyA) A = obj;
        if (obj.physicsObj === evt.bodyB) B = obj;
      }); // check bullet-asteroid and ship-asteroid collisions

      if (!A || !B) return;
      this.gameEngine.trace.trace(function () {
        return "collision between A=".concat(A.toString());
      });
      this.gameEngine.trace.trace(function () {
        return "collision and     B=".concat(B.toString());
      });
      if (A instanceof _Bullet.default && B instanceof _Asteroid.default) this.gameEngine.explode(B, A);
      if (B instanceof _Bullet.default && A instanceof _Asteroid.default) this.gameEngine.explode(A, B);
      if (A instanceof _Ship.default && B instanceof _Asteroid.default) this.kill(A);
      if (B instanceof _Ship.default && A instanceof _Asteroid.default) this.kill(B); // restart game

      if (this.gameEngine.world.queryObjects({
        instanceType: _Asteroid.default
      }).length === 0) this.gameEngine.addAsteroids();
    } // shooting creates a bullet

  }, {
    key: "shoot",
    value: function shoot(player) {
      var radius = player.physicsObj.shapes[0].radius;
      var angle = player.physicsObj.angle + Math.PI / 2;
      var bullet = new _Bullet.default(this.gameEngine, {}, {
        mass: 0.05,
        position: new _lanceGg.TwoVector(radius * Math.cos(angle) + player.physicsObj.position[0], radius * Math.sin(angle) + player.physicsObj.position[1]),
        velocity: new _lanceGg.TwoVector(2 * Math.cos(angle) + player.physicsObj.velocity[0], 2 * Math.sin(angle) + player.physicsObj.velocity[1]),
        angularVelocity: 0
      });
      var obj = this.gameEngine.addObjectToWorld(bullet);
      this.gameEngine.timer.add(this.gameEngine.bulletLifeTime, this.destroyBullet, this, [obj.id]);
    } // destroy the missile if it still exists

  }, {
    key: "destroyBullet",
    value: function destroyBullet(bulletId) {
      if (this.gameEngine.world.objects[bulletId]) {
        this.gameEngine.trace.trace(function () {
          return "bullet[".concat(bulletId, "] destroyed");
        });
        this.gameEngine.removeObjectFromWorld(bulletId);
      }
    }
  }, {
    key: "kill",
    value: function kill(ship) {
      if (ship.lives-- === 0) this.gameEngine.removeObjectFromWorld(ship.id);
    }
  }, {
    key: "onPlayerConnected",
    value: function onPlayerConnected(socket) {
      _get(_getPrototypeOf(AsteroidsServerEngine.prototype), "onPlayerConnected", this).call(this, socket);

      this.gameEngine.addShip(socket.playerId);
    }
  }, {
    key: "onPlayerDisconnected",
    value: function onPlayerDisconnected(socketId, playerId) {
      _get(_getPrototypeOf(AsteroidsServerEngine.prototype), "onPlayerDisconnected", this).call(this, socketId, playerId);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.gameEngine.world.queryObjects({
          playerId: playerId
        })[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var o = _step.value;
          this.gameEngine.removeObjectFromWorld(o.id);
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

  return AsteroidsServerEngine;
}(_lanceGg.ServerEngine);

exports.default = AsteroidsServerEngine;
//# sourceMappingURL=AsteroidsServerEngine.js.map