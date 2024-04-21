import { PhysicalObject2D, BaseTypes, P2PhysicsEngine } from 'lance-gg';
import AsteroidsGameEngine from './AsteroidsGameEngine.js';

export default class Ship extends PhysicalObject2D {
    public lives: number;

    netScheme() {
        return Object.assign({
            lives: { type: BaseTypes.Int8 }
        }, super.netScheme());
    }
    

    // no position bending if difference is larger than 4.0 (i.e. wrap beyond bounds),
    // no angular velocity bending, no local angle bending
    get bending() {
        return {
            position: { max: 4.0 },
            angularVelocity: { percent: 0.0 },
            angleLocal: { percent: 0.0 }
        };
    }

    onAddToWorld() {
        let game = <AsteroidsGameEngine> this.gameEngine;
        let p2 = <P2PhysicsEngine> this.gameEngine.physicsEngine;
        this.physicsObj = p2.addCircle({
            radius: game.shipSize,
            collisionGroup: game.SHIP, // Belongs to the SHIP group
            collisionMask: game.ASTEROID // Only collide with the ASTEROID group
        }, {
            mass: 1,
            position: [this.position.x, this.position.y],
            damping: 0,
            angle: this.angle,
            angularDamping: 0
        });
        this.gameEngine.physicsEngine.world.addBody(this.physicsObj);
    }

    onRemoveFromWorld(gameEngine) {
        this.gameEngine.physicsEngine.world.removeBody(this.physicsObj);
    }

    toString() {
        return `Ship::${super.toString()} lives=${this.lives}`;
    }

    syncTo(other) {
        super.syncTo(other);
        this.lives = other.lives;
    }
}
