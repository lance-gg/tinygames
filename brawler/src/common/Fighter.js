import BaseTypes from 'lance/serialize/BaseTypes';
import DynamicObject from 'lance/serialize/DynamicObject';
import Renderer from 'lance/render/Renderer';

export default class Fighter extends DynamicObject {

    // action can be one of:
    // 1: idle
    // 2: jump
    // 3: fight
    // 4: run
    // 5: die
    static get netScheme() {
        return Object.assign({
            health: { type: BaseTypes.TYPES.INT8 },
            action: { type: BaseTypes.TYPES.INT8 },
            progress: { type: BaseTypes.TYPES.INT8 }
        }, super.netScheme);
    }

    static get ACTIONS() {
        return {
            IDLE: 1, JUMP: 2, FIGHT: 3, RUN: 4, DIE: 5
        };
    }

    onAddToWorld(gameEngine) {
        let renderer = Renderer.getInstance();
        if (renderer) {
            renderer.addFighter(this);
        }
    }

    onRemoveFromWorld(gameEngine) {
    }

    toString() {
        return `Fighter::${super.toString()} health=${this.health} action=${this.action} progress=${this.progress}`;
    }

    syncTo(other) {
        super.syncTo(other);
        this.health = other.health;
        this.action = other.action;
        this.progress = other.progress;
    }
}
