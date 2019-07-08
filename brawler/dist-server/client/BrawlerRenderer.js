"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

var _Fighter = _interopRequireDefault(require("./../common/Fighter"));

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

var PIXI = require('pixi.js');

var game = null;

var BrawlerRenderer =
/*#__PURE__*/
function (_Renderer) {
  _inherits(BrawlerRenderer, _Renderer);

  function BrawlerRenderer(gameEngine, clientEngine) {
    var _this;

    _classCallCheck(this, BrawlerRenderer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BrawlerRenderer).call(this, gameEngine, clientEngine));
    game = gameEngine;
    _this.sprites = {};
    _this.fighterSpriteScale = 1;
    return _this;
  }

  _createClass(BrawlerRenderer, [{
    key: "setDimensions",
    // expand viewport to maximize width or height
    value: function setDimensions() {
      this.pixelsPerSpaceUnit = window.innerWidth / this.gameEngine.spaceWidth;

      if (window.innerHeight < game.spaceHeight * this.pixelsPerSpaceUnit) {
        this.pixelsPerSpaceUnit = window.innerHeight / game.spaceHeight;
      }

      this.viewportWidth = game.spaceWidth * this.pixelsPerSpaceUnit;
      this.viewportHeight = game.spaceHeight * this.pixelsPerSpaceUnit;
    } // initialize renderer.

  }, {
    key: "init",
    value: function init() {
      var _this2 = this;

      this.setDimensions();
      this.stage = new PIXI.Container();
      if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') this.onDOMLoaded();else document.addEventListener('DOMContentLoaded', this.onDOMLoaded.bind(this));
      return new Promise(function (resolve, reject) {
        PIXI.loader.add(Object.keys(_this2.ASSETPATHS).map(function (x) {
          return {
            name: x,
            url: _this2.ASSETPATHS[x]
          };
        })).load(function () {
          _this2.isReady = true;

          _this2.setupStage();

          _this2.textures = {
            IDLE: Object.values(PIXI.loader.resources.idleSheet.textures),
            JUMP: Object.values(PIXI.loader.resources.jumpSheet.textures),
            FIGHT: Object.values(PIXI.loader.resources.meleeSheet.textures),
            RUN: Object.values(PIXI.loader.resources.runSheet.textures),
            DIE: Object.values(PIXI.loader.resources.dieSheet.textures),
            DINO_IDLE: Object.values(PIXI.loader.resources.dinoIdleSheet.textures),
            DINO_WALK: Object.values(PIXI.loader.resources.dinoWalkSheet.textures),
            DINO_RUN: Object.values(PIXI.loader.resources.dinoRunSheet.textures),
            DINO_JUMP: Object.values(PIXI.loader.resources.dinoJumpSheet.textures),
            DINO_DIE: Object.values(PIXI.loader.resources.dinoDieSheet.textures)
          };
          if (isTouchDevice()) document.body.classList.add('touch');else if (isMacintosh()) document.body.classList.add('mac');else if (isWindows()) document.body.classList.add('pc');
          resolve();

          _this2.gameEngine.emit('renderer.ready');
        });
      });
    } // add background sprite

  }, {
    key: "setupStage",
    value: function setupStage() {
      var _this3 = this;

      window.addEventListener('resize', function () {
        _this3.setDimensions();

        _this3.renderer.resize(_this3.viewportWidth, _this3.viewportHeight);
      });
      this.stage.backgroundSprite = new PIXI.Sprite(PIXI.loader.resources.background.texture);
      this.stage.backgroundSprite.width = this.viewportWidth;
      this.stage.backgroundSprite.height = this.viewportHeight;
      this.stage.addChild(this.stage.backgroundSprite);
    }
  }, {
    key: "onDOMLoaded",
    value: function onDOMLoaded() {
      var options = {
        width: this.viewportWidth,
        height: this.viewportHeight,
        antialias: true,
        autoResize: true,
        resolution: window.devicePixelRatio || 1
      };
      this.renderer = PIXI.autoDetectRenderer(options);
      document.body.querySelector('.pixiContainer').appendChild(this.renderer.view);
    }
  }, {
    key: "platformTextures",
    value: function platformTextures(obj) {
      if (obj.y === 0) {
        return {
          left: PIXI.loader.resources.groundLeft.texture,
          middle: PIXI.loader.resources.groundMiddle.texture,
          right: PIXI.loader.resources.groundRight.texture
        };
      }

      return {
        left: PIXI.loader.resources.platformLeft.texture,
        middle: PIXI.loader.resources.platformMiddle.texture,
        right: PIXI.loader.resources.platformRight.texture
      };
    }
  }, {
    key: "randomInt",
    value: function randomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    } // add a single platform game object

  }, {
    key: "addPlatform",
    value: function addPlatform(obj) {
      // create sprites for platform edges, and middle-section
      var textures = this.platformTextures(obj);
      var edgeWidth = game.platformUnit;
      var middleWidth = obj.width - 2 * edgeWidth;
      var sprite = new PIXI.Container();
      var leftEdge = new PIXI.Sprite(textures.left);
      var rightEdge = new PIXI.Sprite(textures.right);
      var middle = new PIXI.extras.TilingSprite(textures.middle);
      var middleHeight = edgeWidth / middle.texture.width * middle.texture.height; // scale the sprites and tile, set the middle-section width

      var scale = edgeWidth * this.pixelsPerSpaceUnit / leftEdge.width;
      leftEdge.scale.set(scale, scale);
      rightEdge.scale.set(scale, scale);
      middle.tileScale.set(scale, scale);
      middle.width = middleWidth * this.pixelsPerSpaceUnit;
      middle.height = middleHeight * this.pixelsPerSpaceUnit; // position the sprites inside container

      middle.x = edgeWidth * this.pixelsPerSpaceUnit;
      rightEdge.x = middle.x + middleWidth * this.pixelsPerSpaceUnit;
      sprite.addChild(leftEdge);
      sprite.addChild(middle);
      sprite.addChild(rightEdge); // add desert stuff

      var stuffCount = Math.max(1, obj.width / game.platformUnit / 4);

      for (var i = 0; i < stuffCount; i++) {
        var stuff = PIXI.loader.resources['desertStuff_' + this.randomInt(5)];
        var stuffSprite = new PIXI.Sprite(stuff.texture);
        stuffSprite.scale.set(scale, scale);
        stuffSprite.x = this.randomInt(rightEdge.x);
        stuffSprite.y = 0 - stuffSprite.height;
        sprite.addChild(stuffSprite);
      }

      this.sprites[obj.id] = sprite;
      sprite.position.set(obj.position.x, obj.position.y);
      this.stage.addChild(sprite);
    } // add a single fighter game object

  }, {
    key: "addFighter",
    value: function addFighter(obj) {
      var sprite = new PIXI.Container();
      sprite.fighterSprite = new PIXI.extras.AnimatedSprite(this.textures.IDLE, PIXI.SCALE_MODES.NEAREST);
      this.fighterSpriteScale = obj.height * this.pixelsPerSpaceUnit / sprite.fighterSprite.height;
      sprite.fighterSprite.scale.set(this.fighterSpriteScale, this.fighterSpriteScale);
      sprite.fighterSprite.anchor.set(0.25, 0.0);
      sprite.addChild(sprite.fighterSprite);
      this.sprites[obj.id] = sprite;
      sprite.position.set(obj.position.x, obj.position.y);
      this.stage.addChild(sprite);
    } // remove a fighter

  }, {
    key: "removeFighter",
    value: function removeFighter(obj) {
      var sprite = this.sprites[obj.id];

      if (sprite) {
        if (sprite.fighterSprite) sprite.fighterSprite.destroy();
        sprite.destroy();
      }
    } // draw all game objects

  }, {
    key: "draw",
    value: function draw(t, dt) {
      var _this4 = this;

      _get(_getPrototypeOf(BrawlerRenderer.prototype), "draw", this).call(this, t, dt);

      if (!this.isReady) return; // assets might not have been loaded yet

      game.world.forEachObject(function (id, obj) {
        var sprite = _this4.sprites[obj.id];
        var spriteOffsetY = 0;

        if (obj instanceof _Fighter.default) {
          if (obj.isDino) {
            sprite.fighterSprite.textures = _this4.textures["DINO_".concat(_Fighter.default.getActionName(obj.action))];
            spriteOffsetY = -3;
          } else {
            sprite.fighterSprite.textures = _this4.textures[_Fighter.default.getActionName(obj.action)];
            spriteOffsetY = -1;
          }

          var textureCount = sprite.fighterSprite.textures.length;
          var progress = (99 - obj.progress) / 100;

          if (obj.action === _Fighter.default.ACTIONS.JUMP) {
            progress = (obj.velocity.y + _this4.gameEngine.jumpSpeed) / (_this4.gameEngine.jumpSpeed * 2);
            if (progress < 0) progress = 0;
            if (progress >= 1) progress = 0.99;
          }

          var image = Math.floor(progress * textureCount);
          sprite.fighterSprite.gotoAndStop(image);
          sprite.fighterSprite.scale.set(obj.direction * _this4.fighterSpriteScale, _this4.fighterSpriteScale);
          sprite.fighterSprite.anchor.x = obj.direction == 1 ? 0.25 : 0.75;
          if (obj.playerId === _this4.gameEngine.playerId) document.getElementById('killsStatus').innerHTML = "kills: ".concat(obj.kills);
        }

        sprite.x = obj.position.x * _this4.pixelsPerSpaceUnit;
        sprite.y = _this4.viewportHeight - (obj.position.y + obj.height + spriteOffsetY) * _this4.pixelsPerSpaceUnit;
      });
      this.renderer.render(this.stage);
    }
  }, {
    key: "ASSETPATHS",
    get: function get() {
      return {
        background: 'assets/deserttileset/png/BG.png',
        groundLeft: 'assets/deserttileset/png/Tile/1.png',
        groundMiddle: 'assets/deserttileset/png/Tile/2.png',
        groundRight: 'assets/deserttileset/png/Tile/3.png',
        platformLeft: 'assets/deserttileset/png/Tile/14.png',
        platformMiddle: 'assets/deserttileset/png/Tile/15.png',
        platformRight: 'assets/deserttileset/png/Tile/16.png',
        desertStuff_0: 'assets/deserttileset/png/Objects/Bush (1).png',
        desertStuff_1: 'assets/deserttileset/png/Objects/Tree.png',
        desertStuff_2: 'assets/deserttileset/png/Objects/Cactus (1).png',
        desertStuff_3: 'assets/deserttileset/png/Objects/Stone.png',
        desertStuff_4: 'assets/deserttileset/png/Objects/Skeleton.png',
        idleSheet: 'assets/adventure_girl/png/Idle.json',
        jumpSheet: 'assets/adventure_girl/png/Jump.json',
        meleeSheet: 'assets/adventure_girl/png/Melee.json',
        runSheet: 'assets/adventure_girl/png/Run.json',
        dieSheet: 'assets/adventure_girl/png/Dead.json',
        dinoIdleSheet: 'assets/dino/png/Idle.json',
        dinoJumpSheet: 'assets/dino/png/Jump.json',
        dinoWalkSheet: 'assets/dino/png/Walk.json',
        dinoRunSheet: 'assets/dino/png/Run.json',
        dinoDieSheet: 'assets/dino/png/Dead.json'
      };
    }
  }]);

  return BrawlerRenderer;
}(_lanceGg.Renderer);

exports.default = BrawlerRenderer;

function isMacintosh() {
  return navigator.platform.indexOf('Mac') > -1;
}

function isWindows() {
  return navigator.platform.indexOf('Win') > -1;
}

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
}
//# sourceMappingURL=BrawlerRenderer.js.map