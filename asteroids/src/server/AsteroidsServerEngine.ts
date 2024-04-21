import { ServerEngine, ServerEngineOptions, TwoVector } from 'lance-gg';
import Asteroid from '../common/Asteroid.js';
import Bullet from '../common/Bullet.js';
import Ship from '../common/Ship.js';
import AsteroidsGameEngine from '../common/AsteroidsGameEngine.js';

export default class AsteroidsServerEngine extends ServerEngine {
    asteroidGameEngine: AsteroidsGameEngine;

    constructor(io: any, gameEngine: AsteroidsGameEngine, inputOptions: ServerEngineOptions) {
        super(io, gameEngine, inputOptions);
        gameEngine.physicsEngine.world.on('beginContact', this.handleCollision.bind(this));
        gameEngine.on('shoot', this.shoot.bind(this));
        this.asteroidGameEngine = (<AsteroidsGameEngine> this.gameEngine)
    }

    start() {
        super.start();
        this.asteroidGameEngine.addAsteroids();
    }

    // handle a collision on server only
    handleCollision(evt) {

        // identify the two objects which collided
        let A;
        let B;
        this.gameEngine.world.forEachObject((id, obj) => {
            if (obj.physicsObj === evt.bodyA) A = obj;
            if (obj.physicsObj === evt.bodyB) B = obj;
        });

        // check bullet-asteroid and ship-asteroid collisions
        if (!A || !B) return;
        this.gameEngine.trace.trace(() => `collision between A=${A.toString()}`);
        this.gameEngine.trace.trace(() => `collision and     B=${B.toString()}`);
        if (A instanceof Bullet && B instanceof Asteroid) this.asteroidGameEngine.explode(B, A);
        if (B instanceof Bullet && A instanceof Asteroid) this.asteroidGameEngine.explode(A, B);
        if (A instanceof Ship && B instanceof Asteroid) this.kill(A);
        if (B instanceof Ship && A instanceof Asteroid) this.kill(B);

        // restart game
        if (this.gameEngine.world.queryObjects({ instanceType: Asteroid }).length === 0) this.asteroidGameEngine.addAsteroids();
    }

    // shooting creates a bullet
    shoot(player) {

        let radius = player.physicsObj.shapes[0].radius;
        let angle = player.physicsObj.angle + Math.PI / 2;
        let bullet = new Bullet(this.gameEngine, {}, {
            mass: 0.05,
            position: new TwoVector(
                radius * Math.cos(angle) + player.physicsObj.position[0],
                radius * Math.sin(angle) + player.physicsObj.position[1]
            ),
            velocity: new TwoVector(
                2 * Math.cos(angle) + player.physicsObj.velocity[0],
                2 * Math.sin(angle) + player.physicsObj.velocity[1]
            ),
            angle: 0,
            angularVelocity: 0
        });
        let obj = this.gameEngine.addObjectToWorld(bullet);
        this.gameEngine.timer.add(this.asteroidGameEngine.bulletLifeTime, this.destroyBullet, this, [obj.id]);
    }

    // destroy the missile if it still exists
    destroyBullet(bulletId) {
        if (this.gameEngine.world.objects[bulletId]) {
            this.gameEngine.trace.trace(() => `bullet[${bulletId}] destroyed`);
            this.gameEngine.removeObjectFromWorld(bulletId);
        }
    }

    kill(ship) {
        if(ship.lives-- === 0) this.gameEngine.removeObjectFromWorld(ship.id);
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);
        this.asteroidGameEngine.addShip(socket.playerId);
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);
        for (let o of this.gameEngine.world.queryObjects({ playerId }))
            this.gameEngine.removeObjectFromWorld(o.id);
    }
}
