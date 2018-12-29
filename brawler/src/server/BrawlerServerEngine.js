import ServerEngine from 'lance/ServerEngine';

export default class BrawlerServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
    }

    start() {
        super.start();

        // add floor
        this.gameEngine.addPlatform({ x: 0, y: 0, width: 160 });

        // add platforms
        this.gameEngine.addPlatform({ x: 10, y: 20, width: 20 });
        this.gameEngine.addPlatform({ x: 50, y: 35, width: 20 });
        this.gameEngine.addPlatform({ x: 90, y: 35, width: 20 });
        this.gameEngine.addPlatform({ x: 130, y: 20, width: 20 });

        // add AI fighters
        this.aiFighters = [];
        for (let i = 0; i < this.gameEngine.aiCount; i++) {
            let f = this.gameEngine.addFighter(0);
            f.AI = true;
            this.aiFighters.push(f);
        }
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
