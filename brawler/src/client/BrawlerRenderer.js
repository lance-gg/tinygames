import Renderer from 'lance/render/Renderer';
import Fighter from './../common/Fighter';
import Platform from './../common/Platform';

let PIXI = require('pixi.js');
let game = null;

export default class BrawlerRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        game = gameEngine;
        this.sprites = {};

        // remove instructions on first input
        game.once('client__processInput', () => {
            document.getElementById('joinGame').classList.add('hidden');
        });
    }

    get ASSETPATHS() {
        return {
            fighter: 'assets/adventure_girl/png/Idle (1).png',
            platform: 'assets/deserttileset/png/Tile/2.png'
        };
    }

    init() {
        this.pixelsPerSpaceUnit = window.innerWidth / this.gameEngine.spaceWidth;
        this.aspectRatio = this.gameEngine.spaceWidth / this.gameEngine.spaceHeight;
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = this.viewportWidth / this.aspectRatio;

        this.stage = new PIXI.Container();

        if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') {
            this.onDOMLoaded();
        } else {
            document.addEventListener('DOMContentLoaded', ()=>{
                this.onDOMLoaded();
            });
        }

        return new Promise((resolve, reject)=>{
            PIXI.loader.add(Object.keys(this.ASSETPATHS).map((x)=>{
                return{
                    name: x,
                    url: this.ASSETPATHS[x]
                };
            }))
            .load(() => {
                this.isReady = true;
                this.setupStage();

                if (isTouchDevice()) {
                    document.body.classList.add('touch');
                } else if (isMacintosh()) {
                    document.body.classList.add('mac');
                } else if (isWindows()) {
                    document.body.classList.add('pc');
                }

                resolve();

                this.gameEngine.emit('renderer.ready');
            });
        });

    }

    setupStage() {
        window.addEventListener('resize', this.setRendererSize.bind(this));
    }

    setRendererSize() {
        this.pixelsPerSpaceUnit = window.innerWidth / this.gameEngine.spaceWidth;
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = this.viewportWidth / this.aspectRatio;
        this.renderer.resize(this.viewportWidth, this.viewportHeight);
    }

    onDOMLoaded() {
        this.renderer = PIXI.autoDetectRenderer(this.viewportWidth, this.viewportHeight);
        document.body.querySelector('.pixiContainer').appendChild(this.renderer.view);
    }

    addPlatform(obj) {
        let sprite = new PIXI.Container();
        sprite.platformSprite = new PIXI.Sprite(PIXI.loader.resources.platform.texture);
        sprite.addChild(sprite.platformSprite);
        sprite.scale.set(0.1, 0.1);
        this.sprites[obj.id] = sprite;
        sprite.position.set(obj.position.x, obj.position.y);
        this.stage.addChild(sprite);
    }

    addFighter(obj) {
        let sprite = new PIXI.Container();
        sprite.fighterSprite = new PIXI.Sprite(PIXI.loader.resources.fighter.texture);
        sprite.addChild(sprite.fighterSprite);
        sprite.scale.set(0.1, 0.1);
        this.sprites[obj.id] = sprite;
        sprite.position.set(obj.position.x, obj.position.y);
        this.stage.addChild(sprite);
    }

    removeFighter(obj) {
        let sprite = this.sprites(obj.id);
        if (sprite) {
            if (sprite.fighterSprite) sprite.fighterSprite.destroy();
            sprite.destroy();
        }
    }

    draw(t, dt) {
        super.draw(t, dt);

        if (!this.isReady) return; // assets might not have been loaded yet

        // Draw all things
        game.world.forEachObject((id, obj) => {
            let sprite = this.sprites[obj.id];
            if (obj instanceof Fighter) {
                sprite.x = obj.position.x * this.pixelsPerSpaceUnit;
                sprite.y = this.viewportHeight - (obj.position.y + obj.height) * this.pixelsPerSpaceUnit;
            } else if (obj instanceof Platform) {
                sprite.x = obj.position.x * this.pixelsPerSpaceUnit;
                sprite.y = this.viewportHeight - (obj.position.y - obj.height) * this.pixelsPerSpaceUnit;
            }
        });

        // update status and render
        this.updateStatus();
        this.renderer.render(this.stage);
    }

    updateStatus() {

        let playerShip = this.gameEngine.world.queryObject({ playerId: this.gameEngine.playerId });

        if (!playerShip) {
            if (this.lives !== undefined)
                document.getElementById('gameover').classList.remove('hidden');
            return;
        }

        // update lives if necessary
        if (playerShip.playerId === this.gameEngine.playerId && this.lives !== playerShip.lives) {
            document.getElementById('lives').innerHTML = 'Lives ' + playerShip.lives;
            this.lives = playerShip.lives;
        }
    }

    removeInstructions() {
        document.getElementById('instructions').classList.add('hidden');
    }
}

function isMacintosh() { return navigator.platform.indexOf('Mac') > -1; }
function isWindows() { return navigator.platform.indexOf('Win') > -1; }
function isTouchDevice() { return 'ontouchstart' in window || navigator.maxTouchPoints; }
