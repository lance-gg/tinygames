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

// /////////////////////////////////////////////////////////
//
// GAME OBJECTS
//
// /////////////////////////////////////////////////////////
var YourGameObject =
/*#__PURE__*/
function (_DynamicObject) {
  _inherits(YourGameObject, _DynamicObject);

  function YourGameObject(gameEngine, options, props) {
    _classCallCheck(this, YourGameObject);

    return _possibleConstructorReturn(this, _getPrototypeOf(YourGameObject).call(this, gameEngine, options, props));
  }

  _createClass(YourGameObject, [{
    key: "syncTo",
    value: function syncTo(other) {
      _get(_getPrototypeOf(YourGameObject.prototype), "syncTo", this).call(this, other);
    }
  }], [{
    key: "netScheme",
    get: function get() {
      return Object.assign({
        health: {
          type: _lanceGg.BaseTypes.TYPES.INT16
        }
      }, _get(_getPrototypeOf(YourGameObject), "netScheme", this));
    }
  }]);

  return YourGameObject;
}(_lanceGg.DynamicObject); // /////////////////////////////////////////////////////////
//
// GAME ENGINE
//
// /////////////////////////////////////////////////////////


var Game =
/*#__PURE__*/
function (_GameEngine) {
  _inherits(Game, _GameEngine);

  function Game(options) {
    var _this;

    _classCallCheck(this, Game);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Game).call(this, options));
    _this.physicsEngine = new _lanceGg.SimplePhysicsEngine({
      gameEngine: _assertThisInitialized(_this)
    }); // common code

    _this.on('postStep', _this.gameLogic.bind(_assertThisInitialized(_this))); // server-only code


    _this.on('server__init', _this.serverSideInit.bind(_assertThisInitialized(_this)));

    _this.on('server__playerJoined', _this.serverSidePlayerJoined.bind(_assertThisInitialized(_this)));

    _this.on('server__playerDisconnected', _this.serverSidePlayerDisconnected.bind(_assertThisInitialized(_this))); // client-only code


    _this.on('client__rendererReady', _this.clientSideInit.bind(_assertThisInitialized(_this)));

    _this.on('client__draw', _this.clientSideDraw.bind(_assertThisInitialized(_this)));

    return _this;
  }

  _createClass(Game, [{
    key: "registerClasses",
    value: function registerClasses(serializer) {
      serializer.registerClass(YourGameObject);
    }
  }, {
    key: "gameLogic",
    value: function gameLogic() {}
  }, {
    key: "processInput",
    value: function processInput(inputData, playerId) {
      _get(_getPrototypeOf(Game.prototype), "processInput", this).call(this, inputData, playerId);
    } // /////////////////////////////////////////////////////////
    //
    // SERVER ONLY CODE
    //
    // /////////////////////////////////////////////////////////

  }, {
    key: "serverSideInit",
    value: function serverSideInit() {}
  }, {
    key: "serverSidePlayerJoined",
    value: function serverSidePlayerJoined(ev) {}
  }, {
    key: "serverSidePlayerDisconnected",
    value: function serverSidePlayerDisconnected(ev) {} // /////////////////////////////////////////////////////////
    //
    // CLIENT ONLY CODE
    //
    // /////////////////////////////////////////////////////////

  }, {
    key: "clientSideInit",
    value: function clientSideInit() {}
  }, {
    key: "clientSideDraw",
    value: function clientSideDraw() {}
  }]);

  return Game;
}(_lanceGg.GameEngine);

exports.default = Game;
//# sourceMappingURL=Game.js.map