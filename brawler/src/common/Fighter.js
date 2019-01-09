import BaseTypes from 'lance/serialize/BaseTypes';
import DynamicObject from 'lance/serialize/DynamicObject';
import Renderer from 'lance/render/Renderer';

export default class Fighter extends DynamicObject {

    // direction is 1 or -1
    // action is one of: idle, jump, fight, run, die
    // progress is used for the animation
    static get netScheme() {
        return Object.assign({
            direction: { type: BaseTypes.TYPES.INT8 },
            action: { type: BaseTypes.TYPES.INT8 },
            progress: { type: BaseTypes.TYPES.INT8 }
        }, super.netScheme);
    }

    static get ACTIONS() {
        return ['IDLE', 'JUMP', 'FIGHT', 'RUN', 'DIE'];
    }

    onAddToWorld(gameEngine) {
        let renderer = Renderer.getInstance();
        if (renderer) renderer.addFighter(this);
    }

    onRemoveFromWorld(gameEngine) {
        let renderer = Renderer.getInstance();
        if (renderer) renderer.removeFighter(this);
    }

    toString() {
        return `Fighter::${super.toString()} direction=${this.direction} action=${this.action} progress=${this.progress}`;
    }

    syncTo(other) {
        super.syncTo(other);
        this.direction = other.direction;
        this.action = other.action;
        this.progress = other.progress;
    }
}
