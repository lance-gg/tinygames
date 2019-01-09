import Renderer from 'lance/render/Renderer';
import Fighter from './../common/Fighter';

let PIXI = require('pixi.js');
let game = null;

export default class BrawlerRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        game = gameEngine;
        this.sprites = {};
        this.fighterSpriteScale = 1;
    }

    get ASSETPATHS() {
        return {
            background: 'assets/deserttileset/png/BG.png',
            platform: 'assets/deserttileset/png/Tile/2.png',
            idleSheet: 'assets/adventure_girl/png/Idle.json',
            jumpSheet: 'assets/adventure_girl/png/Jump.json',
            meleeSheet: 'assets/adventure_girl/png/Melee.json',
            runSheet: 'assets/adventure_girl/png/Run.json',
            dieSheet: 'assets/adventure_girl/png/Dead.json'
        };
    }

    // expand viewport to maximize width or height
    setDimensions() {
        this.pixelsPerSpaceUnit = window.innerWidth / this.gameEngine.spaceWidth;
        if (window.innerHeight < game.spaceHeight * this.pixelsPerSpaceUnit) {
            this.pixelsPerSpaceUnit = window.innerHeight / game.spaceHeight;
        }
        this.viewportWidth = game.spaceWidth * this.pixelsPerSpaceUnit;
        this.viewportHeight = game.spaceHeight * this.pixelsPerSpaceUnit;
    }

    // initialize renderer.
    init() {
        this.setDimensions();
        this.stage = new PIXI.Container();

        if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive')
            this.onDOMLoaded();
        else
            document.addEventListener('DOMContentLoaded', this.onDOMLoaded.bind(this));

        return new Promise((resolve, reject) => {
            PIXI.loader.add(Object.keys(this.ASSETPATHS).map((x) => {
                return {
                    name: x,
                    url: this.ASSETPATHS[x]
                };
            }))
            .load(() => {
                this.isReady = true;
                this.setupStage();

                this.textures = {
                    IDLE: Object.values(PIXI.loader.resources.idleSheet.textures),
                    JUMP: Object.values(PIXI.loader.resources.jumpSheet.textures),
                    FIGHT: Object.values(PIXI.loader.resources.meleeSheet.textures),
                    RUN: Object.values(PIXI.loader.resources.runSheet.textures),
                    DIE: Object.values(PIXI.loader.resources.dieSheet.textures)
                };

                if (isTouchDevice()) document.body.classList.add('touch');
                else if (isMacintosh()) document.body.classList.add('mac');
                else if (isWindows()) document.body.classList.add('pc');

                resolve();
                this.gameEngine.emit('renderer.ready');
            });
        });

    }

    // add background sprite
    setupStage() {
        window.addEventListener('resize', () => {
            this.setDimensions();
            this.renderer.resize(this.viewportWidth, this.viewportHeight);
        });
        this.stage.backgroundSprite = new PIXI.Sprite(PIXI.loader.resources.background.texture);
        this.stage.backgroundSprite.width = this.viewportWidth;
        this.stage.backgroundSprite.height = this.viewportHeight;
        this.stage.addChild(this.stage.backgroundSprite);
    }

    onDOMLoaded() {
        this.renderer = PIXI.autoDetectRenderer(this.viewportWidth, this.viewportHeight);
        document.body.querySelector('.pixiContainer').appendChild(this.renderer.view);
    }

    // add a single platform game object
    addPlatform(obj) {
        let sprite = new PIXI.Container();
        sprite.platformSprite = new PIXI.extras.TilingSprite(
            PIXI.loader.resources.platform.texture,
            obj.width * this.pixelsPerSpaceUnit,
            obj.height * this.pixelsPerSpaceUnit
        );
        sprite.addChild(sprite.platformSprite);
        this.sprites[obj.id] = sprite;
        sprite.position.set(obj.position.x, obj.position.y);
        this.stage.addChild(sprite);
    }

    // add a single fighter game object
    addFighter(obj) {
        let sprite = new PIXI.Container();
        sprite.fighterSprite = new PIXI.extras.AnimatedSprite(this.textures.IDLE);
        this.fighterSpriteScale = obj.height * this.pixelsPerSpaceUnit / sprite.fighterSprite.height;
        sprite.fighterSprite.scale.set(this.fighterSpriteScale, this.fighterSpriteScale);
        sprite.fighterSprite.anchor.set(0.2, 0.0);
        sprite.addChild(sprite.fighterSprite);
        this.sprites[obj.id] = sprite;
        sprite.position.set(obj.position.x, obj.position.y);
        this.stage.addChild(sprite);
    }

    // remove a fighter
    removeFighter(obj) {
        let sprite = this.sprites[obj.id];
        if (sprite) {
            if (sprite.fighterSprite) sprite.fighterSprite.destroy();
            sprite.destroy();
        }
    }

    // draw all game objects
    draw(t, dt) {
        super.draw(t, dt);

        if (!this.isReady) return; // assets might not have been loaded yet

        game.world.forEachObject((id, obj) => {
            let sprite = this.sprites[obj.id];
            sprite.x = obj.position.x * this.pixelsPerSpaceUnit;
            sprite.y = this.viewportHeight - (obj.position.y + obj.height) * this.pixelsPerSpaceUnit;
            if (obj instanceof Fighter) {
                sprite.fighterSprite.textures = this.textures[Fighter.ACTIONS[obj.action]];
                let textureCount = sprite.fighterSprite.textures.length;
                let image = Math.floor((100 - obj.progress)/100 * textureCount);
                sprite.fighterSprite.gotoAndStop(image);

                // console.log(`${Fighter.ACTIONS[obj.action]} - ${image}`);
                sprite.fighterSprite.scale.set(obj.direction * this.fighterSpriteScale, this.fighterSpriteScale);
                sprite.fighterSprite.anchor.x = obj.direction==1?0.2:0.8;
            }
        });

        this.renderer.render(this.stage);
    }
}

function isMacintosh() { return navigator.platform.indexOf('Mac') > -1; }
function isWindows() { return navigator.platform.indexOf('Win') > -1; }
function isTouchDevice() { return 'ontouchstart' in window || navigator.maxTouchPoints; }
