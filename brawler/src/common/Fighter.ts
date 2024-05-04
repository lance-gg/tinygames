import { BaseTypes, DynamicObject, GameEngine, Renderer } from 'lance-gg';
import BrawlerRenderer from '../client/BrawlerRenderer.js';

const ACTIONS = { IDLE: 0, JUMP: 1, FIGHT: 2, RUN: 3, DIE: 4 }
export default class Fighter extends DynamicObject {
    public direction: number;
    public action: number = 0;
    public progress: number = 0;
    public isDino: boolean;
    public kills: any;

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

    static getActionName(a: number): string {
        for (let k in ACTIONS) {
            if (ACTIONS[k] === a)
                return k;
        }
        // the below line should never happen - assert false
        return ACTIONS.IDLE.toString();
    }

    onAddToWorld(gameEngine: GameEngine) {
        this.action = 0;
        this.direction = 1;
        let brawlerRenderer = (<BrawlerRenderer> Renderer.getInstance());
        brawlerRenderer?.addFighter(this);
    }

    onRemoveFromWorld(gameEngine: GameEngine) {
        let brawlerRenderer = (<BrawlerRenderer> Renderer.getInstance());
        brawlerRenderer?.removeFighter(this);
    }

    // two dino's don't collide
    collidesWith(other: Fighter) {
        return !(this.isDino && other.isDino);
    }

    toString() {
        const fighterType = this.isDino?'Dino':'Fighter';
        return `${fighterType}::${super.toString()} direction=${this.direction} action=${this.action} progress=${this.progress}`;
    }

    syncTo(other: Fighter) {
        super.syncTo(other);
        this.direction = other.direction;
        this.action = other.action;
        this.progress = other.progress;
        this.isDino = other.isDino;
        this.kills = other.kills;
    }
}
