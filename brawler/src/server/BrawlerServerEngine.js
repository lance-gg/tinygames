import ServerEngine from 'lance/ServerEngine';

export default class BrawlerServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
        gameEngine.physicsEngine.world.on('beginContact', this.handleCollision.bind(this));
    }

    start() {
        super.start();

        // add platforms
        this.gameEngine.addPlatform({ x: 10, y: 10, width: 20 });
        this.gameEngine.addPlatform({ x: 20, y: 20, width: 20 });
        this.gameEngine.addPlatform({ x: 60, y: 20, width: 20 });
        this.gameEngine.addPlatform({ x: 70, y: 10, width: 20 });

        // add AI fighters
        this.aiFighters = [];
        for (let i = 0; i < this.gameEngine.aiCount; i++) {
            let f = this.gameEngine.addFighter(0);
            f.AI = true;
            this.aiFighters.append(f);
        }
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
        if (A instanceof Bullet && B instanceof Asteroid) this.gameEngine.explode(B, A);
        if (B instanceof Bullet && A instanceof Asteroid) this.gameEngine.explode(A, B);
        if (A instanceof Ship && B instanceof Asteroid) this.kill(A);
        if (B instanceof Ship && A instanceof Asteroid) this.kill(B);

        // restart game
        if (this.gameEngine.world.queryObjects({ instanceType: Asteroid }).length === 0) this.gameEngine.addBrawler();
    }

    kill(ship) {
        if(ship.lives-- === 0) this.gameEngine.removeObjectFromWorld(ship.id);
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);
        this.gameEngine.addFighter(socket.playerId);
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);
        for (let o of this.gameEngine.world.queryObjects({ playerId }))
            this.gameEngine.removeObjectFromWorld(o.id);
    }
}
