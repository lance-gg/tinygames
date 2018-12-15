import BaseTypes from 'lance/serialize/BaseTypes';
import DynamicObject from 'lance/serialize/DynamicObject';
import Renderer from 'lance/render/Renderer';
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
        return `Fighter::${super.toString()} health=${this.health} swing=${this.swingAxe}`;
    }

    syncTo(other) {
        super.syncTo(other);
        this.health = other.health;
        this.swingAxe = other.swingAxe;
    }
}
