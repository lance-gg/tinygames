"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

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

var ACTIONS = {
  IDLE: 0,
  JUMP: 1,
  FIGHT: 2,
  RUN: 3,
  DIE: 4
};

var Fighter =
/*#__PURE__*/
function (_DynamicObject) {
  _inherits(Fighter, _DynamicObject);

  function Fighter() {
    _classCallCheck(this, Fighter);

    return _possibleConstructorReturn(this, _getPrototypeOf(Fighter).apply(this, arguments));
  }

  _createClass(Fighter, [{
    key: "onAddToWorld",
    value: function onAddToWorld(gameEngine) {
      if (_lanceGg.Renderer) _lanceGg.Renderer.getInstance().addFighter(this);
    }
  }, {
    key: "onRemoveFromWorld",
    value: function onRemoveFromWorld(gameEngine) {
      if (_lanceGg.Renderer) _lanceGg.Renderer.getInstance().removeFighter(this);
    } // two dino's don't collide

  }, {
    key: "collidesWith",
    value: function collidesWith(other) {
      return !(this.isDino && other.isDino);
    }
  }, {
    key: "toString",
    value: function toString() {
      var fighterType = this.isDino ? 'Dino' : 'Fighter';
      return "".concat(fighterType, "::").concat(_get(_getPrototypeOf(Fighter.prototype), "toString", this).call(this), " direction=").concat(this.direction, " action=").concat(this.action, " progress=").concat(this.progress);
    }
  }, {
    key: "syncTo",
    value: function syncTo(other) {
      _get(_getPrototypeOf(Fighter.prototype), "syncTo", this).call(this, other);

      this.direction = other.direction;
      this.action = other.action;
      this.progress = other.progress;
      this.isDino = other.isDino;
      this.kills = other.kills;
    }
  }], [{
    key: "getActionName",
    value: function getActionName(a) {
      for (var k in ACTIONS) {
        if (ACTIONS[k] === a) return k;
      }

      return null;
    }
  }, {
    key: "netScheme",
    // direction is 1 or -1
    // action is one of: idle, jump, fight, run, die
    // progress is used for the animation
    get: function get() {
      return Object.assign({
        direction: {
          type: _lanceGg.BaseTypes.TYPES.INT8
        },
        action: {
          type: _lanceGg.BaseTypes.TYPES.INT8
        },
        progress: {
          type: _lanceGg.BaseTypes.TYPES.INT8
        },
        kills: {
          type: _lanceGg.BaseTypes.TYPES.INT8
        },
        isDino: {
          type: _lanceGg.BaseTypes.TYPES.INT8
        }
      }, _get(_getPrototypeOf(Fighter), "netScheme", this));
    }
  }, {
    key: "ACTIONS",
    get: function get() {
      return ACTIONS;
    }
  }]);

  return Fighter;
}(_lanceGg.DynamicObject);

exports.default = Fighter;
//# sourceMappingURL=Fighter.js.map