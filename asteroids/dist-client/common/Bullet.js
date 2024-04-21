import { PhysicalObject2D } from 'lance-gg';
export default class Bullet extends PhysicalObject2D {
    onAddToWorld() {
        let game = this.gameEngine;
        let p2 = this.gameEngine.physicsEngine;
        this.physicsObj = p2.addCircle({
            radius: game.bulletRadius,
            collisionGroup: game.BULLET, // Belongs to the BULLET group
            collisionMask: game.ASTEROID // Can only collide with the ASTEROID group
        }, {
            mass: this.mass,
            damping: 0,
            angularDamping: 0,
            position: [this.position.x, this.position.y],
            velocity: [this.velocity.x, this.velocity.y]
        });
        game.physicsEngine.world.addBody(this.physicsObj);
    }
    onRemoveFromWorld(gameEngine) {
        this.gameEngine.physicsEngine.world.removeBody(this.physicsObj);
    }
    syncTo(other) {
        super.syncTo(other);
    }
    toString() {
        return `Bullet::${super.toString()}`;
    }
}
