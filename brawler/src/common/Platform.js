import BaseTypes from 'lance/serialize/BaseTypes';
import DynamicObject from 'lance/serialize/DynamicObject';
import Renderer from 'lance/render/Renderer';
let game = null;

export default class Platform extends DynamicObject {

    static get netScheme() {
        return Object.assign({
            width: { type: BaseTypes.TYPES.INT8 }
        }, super.netScheme);
    }

    onAddToWorld(gameEngine) {
        let renderer = Renderer.getInstance();
        if (renderer) {
            renderer.addPlatform(this);
        }
    }

    // on remove-from-world, remove the physics body
    onRemoveFromWorld() {
        game.physicsEngine.world.removeBody(this.physicsObj);
    }

    // Adds random .verts to an asteroid body
    addAsteroidVerts() {
        this.physicsObj.verts = [];
        let radius = this.physicsObj.shapes[0].radius;
        for (let j=0; j < game.numAsteroidVerts; j++) {
            let angle = j*2*Math.PI / game.numAsteroidVerts;
            let xv = radius*Math.cos(angle) + game.rand()*radius*0.4;
            let yv = radius*Math.sin(angle) + game.rand()*radius*0.4;
            this.physicsObj.verts.push([xv, yv]);
        }
    }

    syncTo(other) {
        super.syncTo(other);
        this.width = other.width;
    }

    toString() {
        return `Platform::${super.toString()} Width=${this.width}`;
    }
}
