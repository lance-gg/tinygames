import ServerEngine from 'lance/ServerEngine';
import Wiggle from '../common/Wiggle';
import Food from '../common/Food';

export default class WiggleServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
        this.gameEngine.on('postStep', this.stepLogic.bind(this));
    }

    start() {
        super.start();
        for (let f = 0; f < this.gameEngine.foodCount; f++) {
            let newF = new Food(this.gameEngine, null, { position: this.gameEngine.randPos() });
            this.gameEngine.addObjectToWorld(newF);
        }
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);
        let player = new Wiggle(this.gameEngine, null, { position: this.gameEngine.randPos() });
        player.direction = 'up';
        player.bodyLength = this.gameEngine.startBodyLength;
        player.playerId = socket.playerId;
        this.gameEngine.addObjectToWorld(player);
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);
        let playerWiggle = this.gameEngine.world.queryObject({ playerId });
        this.gameEngine.removeObjectFromWorld(playerWiggle.id);
    }

    // Eating Food:
    // increase body length, and remove the food
    wiggleEatFood(w, f) {
        if (!(f.id in this.gameEngine.world.objects))
            return;

        console.log(`wiggle eats food ${f.toString()} ${w.toString()}`);
        w.bodyLength++;
        this.gameEngine.removeObjectFromWorld(f);
        let newF = new Food(this.gameEngine, null, { position: this.gameEngine.randPos() });
        this.gameEngine.addObjectToWorld(newF);
    }

    wiggleHitWiggle(w1, w2) {
        if (!(w2.id in this.gameEngine.world.objects) || !(w1.id in this.gameEngine.world.objects))
            return;

        console.log(`wiggle hit wiggle ${w1.toString()} ${w2.toString()}`);

        this.gameEngine.removeObjectFromWorld(w1);
    }

    stepLogic() {
        let wiggles = this.gameEngine.world.queryObjects({ instanceType: Wiggle });
        let foodObjects = this.gameEngine.world.queryObjects({ instanceType: Food });
        for (let w of wiggles) {

            // check for collision
            for (let w2 of wiggles) {
                if (w === w2)
                    continue;

                for (let i = 0; i < w2.bodyParts.length; i++) {
                    let distance = w2.bodyParts[i].clone().subtract(w.position);
                    if (distance.length() < this.gameEngine.collideDistance)
                        this.wiggleHitWiggle(w, w2);
                }
            }

            // check for food-eating
            for (let f of foodObjects) {
                let distance = w.position.clone().subtract(f.position);
                if (distance.length() < this.gameEngine.eatDistance) {
                    this.wiggleEatFood(w, f);
                }
            }
        }
    }
}
