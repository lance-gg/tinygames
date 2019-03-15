import { BaseTypes, DynamicObject, Renderer } from 'lance-gg';

export default class Fighter extends DynamicObject {

    // direction is 1 or -1
    // action is one of: idle, jump, fight, run, die
    // progress is used for the animation
    static get netScheme() {
        return Object.assign({
            direction: { type: BaseTypes.TYPES.INT8 },
            action: { type: BaseTypes.TYPES.INT8 },
            progress: { type: BaseTypes.TYPES.INT8 },
            kills: { type: BaseTypes.TYPES.INT8 },
            isDino: { type: BaseTypes.TYPES.INT8 }
        }, super.netScheme);
    }

    static get ACTIONS() {
        return ['IDLE', 'JUMP', 'FIGHT', 'RUN', 'DIE'];
    }

    onAddToWorld(gameEngine) {
        if (Renderer)
            Renderer.getInstance().addFighter(this);
    }

    onRemoveFromWorld(gameEngine) {
        if (Renderer)
            Renderer.getInstance().removeFighter(this);
    }

    // two dino's don't collide
    collidesWith(other) {
        return !(this.isDino && other.isDino);
    }

    toString() {
        const fighterType = this.isDino?'Dino':'Fighter';
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
