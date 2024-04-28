var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Renderer } from 'lance-gg';
import Fighter from '../common/Fighter.js';
import { AnimatedSprite, Application, Assets, Container, Sprite, TilingSprite } from 'pixi.js';
let game;
const ACTION_TO_SHEET = {
    IDLE: 'idleSheet',
    JUMP: 'jumpSheet',
    FIGHT: 'meleeSheet',
    RUN: 'runSheet',
    DIE: 'dieSheet',
    DINO_IDLE: 'dinoIdleSheet',
    DINO_WALK: 'dinoWalkSheet',
    DINO_RUN: 'dinoRunSheet',
    DINO_JUMP: 'dinoJumpSheet',
    DINO_DIE: 'dinoDieSheet'
};
const ASSETPATHS = {
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
export default class BrawlerRenderer extends Renderer {
    constructor(gameEngine) {
        super(gameEngine);
        game = gameEngine;
        this.pixiApp = new Application();
        this.containers = {};
        this.fighterSpriteScale = 1;
    }
    getTexture(action) {
        return this.textures[ACTION_TO_SHEET[action]];
    }
    // expand viewport to maximize width or height
    setDimensions() {
        this.pixelsPerSpaceUnit = window.innerWidth / game.spaceWidth;
        if (window.innerHeight < game.spaceHeight * this.pixelsPerSpaceUnit) {
            this.pixelsPerSpaceUnit = window.innerHeight / game.spaceHeight;
        }
        this.viewportWidth = game.spaceWidth * this.pixelsPerSpaceUnit;
        this.viewportHeight = game.spaceHeight * this.pixelsPerSpaceUnit;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("init started");
            this.setDimensions();
            yield this.pixiApp.init({
                antialias: true,
                background: '#1099bb',
                resizeTo: window
            });
            console.log("pixiApp ready");
            if (document.readyState === 'complete' || document.readyState === 'interactive')
                this.onDOMLoaded();
            else
                document.addEventListener('DOMContentLoaded', this.onDOMLoaded.bind(this));
            for (const [alias, src] of Object.entries(ASSETPATHS)) {
                Assets.add({ alias, src });
            }
            this.textures = yield Assets.load(Object.keys(ASSETPATHS));
            console.log("assets loaded");
            this.isReady = true;
            this.setupStage();
            if (isTouchDevice())
                document.body.classList.add('touch');
            else if (isMacintosh())
                document.body.classList.add('mac');
            else if (isWindows())
                document.body.classList.add('pc');
            console.log("about to emit renderer.ready");
            this.gameEngine.emit('renderer.ready');
        });
    }
    // add background sprite
    setupStage() {
        window.addEventListener('resize', () => {
            this.setDimensions();
            // this.pixiApp.resize(this.viewportWidth, this.viewportHeight);
            this.pixiApp.resize();
        });
        let backgroundSprite = new Sprite(this.textures.background);
        backgroundSprite.width = this.viewportWidth;
        backgroundSprite.height = this.viewportHeight;
        this.pixiApp.stage.addChild(backgroundSprite);
    }
    onDOMLoaded() {
        // this.pixiRenderer = PIXI.autoDetectRenderer(options);
        // document.body.appendChild(this.pixiApp.canvas);
        console.log("dom is loaded, adding the pixi container");
        document.body.querySelector('.pixiContainer').appendChild(this.pixiApp.canvas);
        this.pixiApp.resizeTo = document.body.querySelector('.pixiContainer');
    }
    platformTextures(obj) {
        if (obj.y === 0) {
            return {
                left: this.textures.groundLeft, // PIXI.loader.resources.groundLeft.texture,
                middle: this.textures.groundMiddle, //PIXI.loader.resources.groundMiddle.texture,
                right: this.textures.groundRight // PIXI.loader.resources.groundRight.texture
            };
        }
        return {
            left: this.textures.platformLeft, // PIXI.loader.resources.platformLeft.texture,
            middle: this.textures.platformMiddle, // PIXI.loader.resources.platformMiddle.texture,
            right: this.textures.platformRight, // PIXI.loader.resources.platformRight.texture
        };
    }
    randomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    // add a single platform game object
    addPlatform(obj) {
        console.log("adding platform");
        // create sprites for platform edges, and middle-section
        let textures = this.platformTextures(obj);
        let edgeWidth = game.platformUnit;
        let middleWidth = obj.width - (2 * edgeWidth);
        let container = new Container();
        let leftEdge = new Sprite(textures.left);
        let rightEdge = new Sprite(textures.right);
        let middle = new TilingSprite(textures.middle);
        let middleHeight = edgeWidth / middle.texture.width * middle.texture.height;
        // scale the sprites and tile, set the middle-section width
        let scale = edgeWidth * this.pixelsPerSpaceUnit / leftEdge.width;
        leftEdge.scale.set(scale, scale);
        rightEdge.scale.set(scale, scale);
        middle.tileScale.set(scale, scale);
        middle.width = middleWidth * this.pixelsPerSpaceUnit;
        middle.height = middleHeight * this.pixelsPerSpaceUnit;
        // position the sprites inside container
        middle.x = edgeWidth * this.pixelsPerSpaceUnit;
        rightEdge.x = middle.x + middleWidth * this.pixelsPerSpaceUnit;
        container.addChild(leftEdge);
        container.addChild(middle);
        container.addChild(rightEdge);
        // add desert stuff
        let stuffCount = Math.max(1, obj.width / game.platformUnit / 4);
        for (let i = 0; i < stuffCount; i++) {
            let stuff = this.textures['desertStuff_' + this.randomInt(5)];
            let stuffSprite = new Sprite(stuff);
            stuffSprite.scale.set(scale, scale);
            stuffSprite.x = this.randomInt(rightEdge.x);
            stuffSprite.y = 0 - (stuffSprite.height);
            container.addChild(stuffSprite);
        }
        this.containers[obj.id] = container;
        container.position.set(obj.position.x, obj.position.y);
        this.pixiApp.stage.addChild(container);
    }
    // add a single fighter game object
    addFighter(obj) {
        console.log("adding fighter");
        let container = new Container();
        // let fighterSprite = new AnimatedSprite(this.textures.IDLE,PIXI.SCALE_MODES.NEAREST);
        // let textures = <Texture[]> Object.values(this.textures.idleSheet.textures);
        let fighterSprite = new AnimatedSprite(Object.values(this.textures.idleSheet.textures));
        this.fighterSpriteScale = obj.height * this.pixelsPerSpaceUnit / fighterSprite.height;
        fighterSprite.scale.set(this.fighterSpriteScale, this.fighterSpriteScale);
        fighterSprite.anchor.set(0.25, 0.0);
        container.addChild(fighterSprite);
        this.containers[obj.id] = container;
        container.position.set(obj.position.x, obj.position.y);
        this.pixiApp.stage.addChild(container);
        console.log(`adding fighter ${obj.id} ${obj.position.x} ${obj.position.y}`);
    }
    // remove a fighter
    removeFighter(obj) {
        let container = this.containers[obj.id];
        container.destroy({ children: true });
    }
    // draw all game objects
    draw(t, dt) {
        super.draw(t, dt);
        if (!this.isReady)
            return; // assets might not have been loaded yet
        game.world.forEachObject((id, obj) => {
            let container = this.containers[obj.id];
            let spriteOffsetY = 0;
            if (obj instanceof Fighter) {
                let fighterSprite = container.getChildByLabel('Sprite');
                let sheet;
                if (obj.isDino) {
                    sheet = this.getTexture(`DINO_${Fighter.getActionName(obj.action)}`);
                    spriteOffsetY = -3;
                }
                else {
                    sheet = this.getTexture(Fighter.getActionName(obj.action));
                    spriteOffsetY = -1;
                }
                fighterSprite.textures = Object.values(sheet.textures);
                let textureCount = fighterSprite.textures.length;
                let progress = (99 - obj.progress) / 100;
                if (obj.action === Fighter.ACTIONS.JUMP) {
                    progress = (obj.velocity.y + game.jumpSpeed) / (game.jumpSpeed * 2);
                    if (progress < 0)
                        progress = 0;
                    if (progress >= 1)
                        progress = 0.99;
                }
                let image = Math.floor(progress * textureCount);
                fighterSprite.gotoAndStop(image);
                fighterSprite.scale.set(obj.direction * this.fighterSpriteScale, this.fighterSpriteScale);
                fighterSprite.anchor.x = obj.direction == 1 ? 0.25 : 0.75;
                if (obj.playerId === this.gameEngine.playerId)
                    document.getElementById('killsStatus').innerHTML = `kills: ${obj.kills}`;
            }
            container.x = obj.position.x * this.pixelsPerSpaceUnit;
            container.y = this.viewportHeight - (obj.position.y + obj.height + spriteOffsetY) * this.pixelsPerSpaceUnit;
        });
    }
}
function isMacintosh() { return navigator.platform.indexOf('Mac') > -1; }
function isWindows() { return navigator.platform.indexOf('Win') > -1; }
function isTouchDevice() { return 'ontouchstart' in window || navigator.maxTouchPoints; }
