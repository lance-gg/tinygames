import { PhysicalObject2D, BaseTypes } from 'lance-gg';
export default class Asteroid extends PhysicalObject2D {
    netScheme() {
        return Object.assign({
            level: { type: BaseTypes.Int16 }
        }, super.netScheme());
    }
    // position bending: bend fully to server position in each sync [percent=1.0],
    // unless the position difference is larger than 4.0 (i.e. wrap beyond bounds)
    get bending() {
        return { position: { max: 4.0 } };
    }
    // on add-to-world, create a physics body
    onAddToWorld() {
        let game = this.gameEngine;
        let p2 = this.gameEngine.physicsEngine;
        this.physicsObj = p2.addCircle({
            radius: game.asteroidRadius * (game.numAsteroidLevels - this.level) / game.numAsteroidLevels,
            collisionGroup: game.ASTEROID, // Belongs to the ASTEROID group
            collisionMask: game.BULLET | game.SHIP // Can collide with the BULLET or SHIP group
        }, {
            mass: this.mass,
            damping: 0,
            angularDamping: 0,
            position: [this.position.x, this.position.y],
            velocity: [this.velocity.x, this.velocity.y]
        });
        this.addAsteroidVerts();
        game.physicsEngine.world.addBody(this.physicsObj);
    }
    // on remove-from-world, remove the physics body
    onRemoveFromWorld() {
        this.gameEngine.physicsEngine.world.removeBody(this.physicsObj);
    }
    // Adds random .verts to an asteroid body
    addAsteroidVerts() {
        let game = this.gameEngine;
        this.physicsObj.verts = [];
        let radius = this.physicsObj.shapes[0].radius;
        for (let j = 0; j < game.numAsteroidVerts; j++) {
            let angle = j * 2 * Math.PI / game.numAsteroidVerts;
            let xv = radius * Math.cos(angle) + game.rand() * radius * 0.4;
            let yv = radius * Math.sin(angle) + game.rand() * radius * 0.4;
            this.physicsObj.verts.push([xv, yv]);
        }
    }
    syncTo(other) {
        super.syncTo(other);
    }
    toString() {
        return `Asteroid::${super.toString()} Level${this.level}`;
    }
}
