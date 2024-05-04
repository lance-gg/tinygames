import { GameEngine, SimplePhysicsEngine, TwoVector } from 'lance-gg';
import Wiggle from './Wiggle.js';
import Food from './Food.js';
export default class WiggleGameEngine extends GameEngine {
    constructor(options) {
        super(options);
        this.foodRadius = 0.1;
        this.headRadius = 0.15;
        this.bodyRadius = 0.1;
        this.eyeDist = 0.08;
        this.eyeRadius = 0.03;
        this.eyeAngle = 0.5;
        this.spaceWidth = 16;
        this.spaceHeight = 9;
        this.moveDist = 0.06;
        this.foodCount = 16;
        this.eatDistance = 0.3;
        this.collideDistance = 0.3;
        this.startBodyLength = 10;
        this.aiCount = 3;
        this.directionStop = 100;
        this.physicsEngine = new SimplePhysicsEngine({
            gameEngine: this,
            collisionsType: 'bruteForce',
            collisions: { autoResolve: false },
        });
        this.on('preStep', this.moveAll.bind(this));
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
        let wiggles = this.world.queryObjects({ instanceType: Wiggle });
        for (let w of wiggles) {
            // if the position changed, add a body part and trim the length
            let pos = w.position.clone();
            if (w.bodyParts.length === 0 || pos.subtract(w.bodyParts[w.bodyParts.length - 1]).length() > 0.05) {
                w.bodyParts.push(w.position.clone());
                while (w.bodyLength < w.bodyParts.length)
                    w.bodyParts.shift();
            }
            // if not stopped, move along
            if (w.direction === this.directionStop)
                return;
            let move = new TwoVector(Math.cos(w.direction), Math.sin(w.direction));
            move.multiplyScalar(0.05);
            w.position.add(move);
            w.position.y = Math.min(w.position.y, this.spaceHeight / 2);
            w.position.y = Math.max(w.position.y, -this.spaceHeight / 2);
            w.position.x = Math.min(w.position.x, this.spaceWidth / 2);
            w.position.x = Math.max(w.position.x, -this.spaceWidth / 2);
        }
    }
    processInput(inputData, playerId, isServer) {
        super.processInput(inputData, playerId, isServer);
        // get the player's primary object
        let wiggle = this.world.queryOneObject({ playerId, instanceType: Wiggle });
        if (wiggle) {
            wiggle.direction = Number(inputData.input);
        }
    }
}
