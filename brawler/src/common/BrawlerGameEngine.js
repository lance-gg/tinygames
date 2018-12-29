import GameEngine from 'lance/GameEngine';
import SimplePhysicsEngine from 'lance/physics/SimplePhysicsEngine';
import TwoVector from 'lance/serialize/TwoVector';
import Fighter from './Fighter';
import Platform from './Platform';

export default class BrawlerGameEngine extends GameEngine {

    constructor(options) {
        super(options);

        // game variables
        // note, fighter image is 641:542
        Object.assign(this, {
            aiCount: 2, spaceWidth: 160, spaceHeight: 90,
            fighterWidth: 10, fighterHeight: 12, jumpSpeed: 2,
            walkSpeed: 0.6
        });

        this.physicsEngine = new SimplePhysicsEngine({
            gravity: new TwoVector(0, -0.05),
            collisions: { type: 'bruteForce', autoResolve: true },
            gameEngine: this
        });
        this.on('collisionStart', this.handleCollision.bind(this));
        this.on('preStep', this.moveAll.bind(this));
    }

    handleCollision(evt) {
        console.log(`collision: o1=${evt.o1.toString()} o2=${evt.o2.toString()}`);
    }

    registerClasses(serializer) {
        serializer.registerClass(Platform);
        serializer.registerClass(Fighter);
    }

    processInput(inputData, playerId) {

        super.processInput(inputData, playerId);

        // handle keyboard presses:
        // right, left - move fighter
        // up - jump; space - swing the axe
        let fighter = this.world.queryObject({ playerId: playerId, instanceType: Fighter });
        if (fighter) {
            if (inputData.input === 'right') fighter.position.x += this.walkSpeed;
            else if (inputData.input === 'left') fighter.position.x -= this.walkSpeed;
            else if (inputData.input === 'up') {
                if (fighter.velocity.length() === 0) fighter.velocity.y = this.jumpSpeed;
            } else if (inputData.input === 'space') {
                if (fighter.swingAxe === 0) fighter.swingAxe = 60;
            }
            fighter.refreshToPhysics();
        }
    }

    moveAll(stepInfo) {

        if (stepInfo.isReenact)
            return;

        this.world.forEachObject((id, obj) => {
            if (obj instanceof Fighter) {
                if (obj.swingAxe > 0) obj.swingAxe--;
            }
        });
    }

    // create fighter
    addFighter(playerId) {
        let f = new Fighter(this, null, {
            position: this.randomPosition()
        });
        f.playerId = playerId;
        f.height = this.fighterHeight;
        f.width = this.fighterWidth;
        f.swingAxe = 0;
        this.addObjectToWorld(f);
        return f;
    }

    // create a platform
    addPlatform(desc) {
        let p = new Platform(this, null, {
            playerId: 0, position: new TwoVector(desc.x, desc.y)
        });
        p.width = desc.width;
        p.height = 10;
        p.isStatic = 1;
        this.addObjectToWorld(p);
        return p;
    }

    randomPosition() {
        return new TwoVector(this.spaceWidth / 4 + Math.random() * this.spaceWidth/2, 70);
    }

}
