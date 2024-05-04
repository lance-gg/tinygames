import { BruteForceCollisionDetectionOptions, GameEngine, GameEngineOptions, InputDesc, PreStepDesc, Serializer, SimplePhysicsEngine, TwoVector } from 'lance-gg';
import Wiggle from './Wiggle.js';
import Food from './Food.js';

export default class WiggleGameEngine extends GameEngine {

    readonly foodRadius = 0.1;
    readonly headRadius = 0.15;
    readonly bodyRadius = 0.1;
    readonly eyeDist = 0.08;
    readonly eyeRadius = 0.03; 
    readonly eyeAngle = 0.5;
    readonly spaceWidth = 16; 
    readonly spaceHeight = 9;
    readonly moveDist = 0.06;
    readonly foodCount = 16;
    readonly eatDistance = 0.3; 
    readonly collideDistance = 0.3;
    readonly startBodyLength = 10; 
    readonly aiCount = 3; 
    readonly directionStop = 100;

    constructor(options: GameEngineOptions) {
        super(options);

        this.physicsEngine = new SimplePhysicsEngine({
            gameEngine: this,
            collisionsType: 'bruteForce',
            collisions: <BruteForceCollisionDetectionOptions> { autoResolve: false },

        });
        this.on('preStep', this.moveAll.bind(this));
    }

    registerClasses(serializer: Serializer) {
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

    moveAll(stepInfo: PreStepDesc) {

        if (stepInfo.isReenact)
            return;

        let wiggles = <Wiggle[]>this.world.queryObjects({ instanceType: Wiggle });

        for (let w of wiggles) {

            // if the position changed, add a body part and trim the length
            let pos = w.position.clone();
            if (w.bodyParts.length === 0 || pos.subtract(w.bodyParts[w.bodyParts.length-1]).length() > 0.05) {
                w.bodyParts.push(w.position.clone());
                while (w.bodyLength < w.bodyParts.length) w.bodyParts.shift();
            }

            // if not stopped, move along
            if (w.direction === this.directionStop) return;
            let move = new TwoVector(Math.cos(w.direction), Math.sin(w.direction));
            move.multiplyScalar(0.05);
            w.position.add(move);
            w.position.y = Math.min(w.position.y, this.spaceHeight / 2);
            w.position.y = Math.max(w.position.y, -this.spaceHeight / 2);
            w.position.x = Math.min(w.position.x, this.spaceWidth / 2);
            w.position.x = Math.max(w.position.x, -this.spaceWidth / 2);
        }
    }

    processInput(inputData: InputDesc, playerId: number, isServer: boolean) {

        super.processInput(inputData, playerId, isServer);

        // get the player's primary object
        let wiggle = <Wiggle> this.world.queryOneObject({ playerId, instanceType: Wiggle });
        if (wiggle) {
            wiggle.direction = Number(inputData.input);
        }
    }
}
