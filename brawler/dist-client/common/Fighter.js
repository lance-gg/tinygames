import { BaseTypes, DynamicObject, Renderer } from 'lance-gg';
const ACTIONS = { IDLE: 0, JUMP: 1, FIGHT: 2, RUN: 3, DIE: 4 };
export default class Fighter extends DynamicObject {
    constructor() {
        super(...arguments);
        this.action = 0;
        this.progress = 0;
    }
    // direction is 1 or -1
    // action is one of: idle, jump, fight, run, die
    // progress is used for the animation
    netScheme() {
        return Object.assign({
            direction: { type: BaseTypes.Int8 },
            action: { type: BaseTypes.Int8 },
            progress: { type: BaseTypes.Int8 },
            kills: { type: BaseTypes.Int8 },
            isDino: { type: BaseTypes.Int8 }
        }, super.netScheme());
    }
    static get ACTIONS() {
        return ACTIONS;
    }
    static getActionName(a) {
        for (let k in ACTIONS) {
            if (ACTIONS[k] === a)
                return k;
        }
        // the below line should never happen - assert false
        return ACTIONS.IDLE.toString();
    }
    onAddToWorld(gameEngine) {
        this.action = 0;
        this.direction = 1;
        let brawlerRenderer = Renderer.getInstance();
        brawlerRenderer === null || brawlerRenderer === void 0 ? void 0 : brawlerRenderer.addFighter(this);
    }
    onRemoveFromWorld(gameEngine) {
        let brawlerRenderer = Renderer.getInstance();
        brawlerRenderer === null || brawlerRenderer === void 0 ? void 0 : brawlerRenderer.removeFighter(this);
    }
    // two dino's don't collide
    collidesWith(other) {
        return !(this.isDino && other.isDino);
    }
    toString() {
        const fighterType = this.isDino ? 'Dino' : 'Fighter';
        return `${fighterType}::${super.toString()} direction=${this.direction} action=${this.action} progress=${this.progress}`;
    }
    syncTo(other) {
        super.syncTo(other);
        this.direction = other.direction;
        this.action = other.action;
        this.progress = other.progress;
        this.isDino = other.isDino;
        this.kills = other.kills;
    }
}
