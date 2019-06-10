"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lanceGg = require("lance-gg");

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
var p2 = null;

var Asteroid =
/*#__PURE__*/
function (_PhysicalObject2D) {
  _inherits(Asteroid, _PhysicalObject2D);

  function Asteroid() {
    _classCallCheck(this, Asteroid);

    return _possibleConstructorReturn(this, _getPrototypeOf(Asteroid).apply(this, arguments));
  }

  _createClass(Asteroid, [{
    key: "onAddToWorld",
    // on add-to-world, create a physics body
    value: function onAddToWorld() {
      game = this.gameEngine;
      p2 = game.physicsEngine.p2;
      this.physicsObj = new p2.Body({
        mass: this.mass,
        damping: 0,
        angularDamping: 0,
        position: [this.position.x, this.position.y],
        velocity: [this.velocity.x, this.velocity.y]
      });
      this.physicsObj.addShape(new p2.Circle({
        radius: game.asteroidRadius * (game.numAsteroidLevels - this.level) / game.numAsteroidLevels,
        collisionGroup: game.ASTEROID,
        // Belongs to the ASTEROID group
        collisionMask: game.BULLET | game.SHIP // Can collide with the BULLET or SHIP group

      }));
      this.addAsteroidVerts();
      game.physicsEngine.world.addBody(this.physicsObj);
    } // on remove-from-world, remove the physics body

  }, {
    key: "onRemoveFromWorld",
    value: function onRemoveFromWorld() {
      game.physicsEngine.world.removeBody(this.physicsObj);
    } // Adds random .verts to an asteroid body

  }, {
    key: "addAsteroidVerts",
    value: function addAsteroidVerts() {
      this.physicsObj.verts = [];
      var radius = this.physicsObj.shapes[0].radius;

      for (var j = 0; j < game.numAsteroidVerts; j++) {
        var angle = j * 2 * Math.PI / game.numAsteroidVerts;
        var xv = radius * Math.cos(angle) + game.rand() * radius * 0.4;
        var yv = radius * Math.sin(angle) + game.rand() * radius * 0.4;
        this.physicsObj.verts.push([xv, yv]);
      }
    }
  }, {
    key: "syncTo",
    value: function syncTo(other) {
      _get(_getPrototypeOf(Asteroid.prototype), "syncTo", this).call(this, other);
    }
  }, {
    key: "toString",
    value: function toString() {
      return "Asteroid::".concat(_get(_getPrototypeOf(Asteroid.prototype), "toString", this).call(this), " Level").concat(this.level);
    }
  }, {
    key: "bending",
    // position bending: bend fully to server position in each sync [percent=1.0],
    // unless the position difference is larger than 4.0 (i.e. wrap beyond bounds)
    get: function get() {
      return {
        position: {
          max: 4.0
        }
      };
    }
  }], [{
    key: "netScheme",
    get: function get() {
      return Object.assign({
        level: {
          type: _lanceGg.BaseTypes.TYPES.INT16
        }
      }, _get(_getPrototypeOf(Asteroid), "netScheme", this));
    }
  }]);

  return Asteroid;
}(_lanceGg.PhysicalObject2D);

exports["default"] = Asteroid;
//# sourceMappingURL=Asteroid.js.map