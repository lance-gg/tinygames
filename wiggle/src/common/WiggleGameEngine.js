import GameEngine from 'lance/GameEngine';
import SimplePhysicsEngine from 'lance/physics/SimplePhysicsEngine';
import TwoVector from 'lance/serialize/TwoVector';
import Wiggle from './Wiggle';
import Food from './Food';

export default class WiggleGameEngine extends GameEngine {

    constructor(options) {
        super(options);
        this.physicsEngine = new SimplePhysicsEngine({ gameEngine: this });
        this.on('preStep', this.moveAll.bind(this));

        // game variables
        Object.assign(this, {
            foodRadius: 0.1, headRadius: 0.15, bodyRadius: 0.1,
            spaceWidth: 16, spaceHeight: 9, moveDist: 0.06,
            foodCount: 16, eatDistance: 0.3, collideDistance: 0.3,
            startBodyLength: 10
        });
    }

    registerClasses(serializer) {
        serializer.registerClass(Wiggle);
        serializer.registerClass(Food);
    }

    start() {
        super.start();
    }

    randPos() {
        let x = (Math.random() - 0.5) * this.spaceWidth;
        let y = (Math.random() - 0.5) * this.spaceHeight;
        return new TwoVector(x, y);
    }

    moveAll(stepInfo) {

        if (stepInfo.isReenact)
            return;

        this.world.forEachObject((id, obj) => {
            if (obj instanceof Wiggle) {

                // add a body part and trim the length
                obj.bodyParts.push(obj.position.clone());
                while (obj.bodyLength < obj.bodyParts.length) obj.bodyParts.shift();

                // calculate next position
                switch (obj.direction) {
                case 'up':
                    obj.position.y += this.moveDist; break;
                case 'down':
                    obj.position.y -= this.moveDist; break;
                case 'right':
                    obj.position.x += this.moveDist; break;
                case 'left':
                    obj.position.x -= this.moveDist; break;
                }

                if (obj.position.y > this.spaceHeight / 2) obj.direction = 'down';
                if (obj.position.x > this.spaceWidth / 2) obj.direction = 'left';
                if (obj.position.y < -this.spaceHeight / 2) obj.direction = 'up';
                if (obj.position.x < -this.spaceWidth / 2) obj.direction = 'right';
            }
        });
    }

    processInput(inputData, playerId) {

        super.processInput(inputData, playerId);

        // get the player's primary object
        let player = this.world.queryObject({ playerId });
        if (player) {
            player.direction = inputData.input;
        }
    }
}
