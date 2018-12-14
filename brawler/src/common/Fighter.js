import BaseTypes from 'lance/serialize/BaseTypes';
import DynamicObject from 'lance/serialize/DynamicObject';

let game = null;

export default class Fighter extends DynamicObject {

    static get netScheme() {
        return Object.assign({
            health: { type: BaseTypes.TYPES.INT8 },
            swingAxe: { type: BaseTypes.TYPES.INT8 }
        }, super.netScheme);
    }

    onAddToWorld(gameEngine) {
        let renderer = Renderer.getInstance();
        if (renderer) {
            renderer.addFighter(this);
        }
    }

    onRemoveFromWorld(gameEngine) {
        game.physicsEngine.world.removeBody(this.physicsObj);
    }

    toString() {
        return `Ship::${super.toString()} lives=${this.lives}`;
    }

    syncTo(other) {
        super.syncTo(other);
        this.lives = other.lives;
    }
}
