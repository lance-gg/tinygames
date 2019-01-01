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
            walkSpeed: 0.6, killDistance: 15
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
        // console.log(`collision: o1=${evt.o1.toString()} o2=${evt.o2.toString()}`);
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
            let nextAction = null;
            if (inputData.input === 'right') {
                fighter.position.x += this.walkSpeed;
                fighter.direction = 1;
                nextAction = Fighter.ACTIONS.indexOf('RUN');
            } else if (inputData.input === 'left') {
                fighter.position.x -= this.walkSpeed;
                fighter.direction = -1;
                nextAction = Fighter.ACTIONS.indexOf('RUN');
            } else if (inputData.input === 'up') {
                if (fighter.velocity.length() === 0) fighter.velocity.y = this.jumpSpeed;
                nextAction = Fighter.ACTIONS.indexOf('JUMP');
            } else if (inputData.input === 'space') {
                nextAction = Fighter.ACTIONS.indexOf('FIGHT');
            } else {
                nextAction = Fighter.ACTIONS.indexOf('IDLE');
            }
            if (fighter.action !== nextAction)
                fighter.progress = 60;
            fighter.action = nextAction;
            fighter.refreshToPhysics();
        }
    }

    moveAll(stepInfo) {

        if (stepInfo.isReenact)
            return;

        // advance animation progress for all fighters
        let fighters = this.world.queryObjects({ instanceType: Fighter });
        for (let f1 of fighters) {
            f1.progress--;
            if (f1.progress < 0) {
                f1.progress += 60;
                f1.action = Fighter.ACTIONS.indexOf('IDLE');
            }

            // check if the fighter has killed another fighter
            if (f1.action === Fighter.ACTIONS.indexOf('FIGHT')) {
                for (let f2 of fighters) {
                    if (f2 !== f1 && Math.abs(f1.position.x - f2.position.x) <= this.killDistance) {
                        f2.action = Fighter.ACTIONS.indexOf('DIE');
                    }
                }
            }
        }
    }

    // create fighter
    addFighter(playerId) {
        let f = new Fighter(this, null, {
            position: this.randomPosition()
        });
        f.playerId = playerId;
        f.height = this.fighterHeight;
        f.width = this.fighterWidth;
        f.direction = 1;
        f.progress = 0;
        f.action = 0;
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
