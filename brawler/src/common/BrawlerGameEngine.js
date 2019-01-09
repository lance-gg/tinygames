import GameEngine from 'lance/GameEngine';
import SimplePhysicsEngine from 'lance/physics/SimplePhysicsEngine';
import TwoVector from 'lance/serialize/TwoVector';
import Fighter from './Fighter';
import Platform from './Platform';

export default class BrawlerGameEngine extends GameEngine {

    constructor(options) {
        super(options);

        // game variables
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
        this.on('preStep', this.moveAll.bind(this));
    }

    registerClasses(serializer) {
        serializer.registerClass(Platform);
        serializer.registerClass(Fighter);
    }

    processInput(inputData, playerId) {

        super.processInput(inputData, playerId);

        // handle keyboard presses:
        // right, left - set direction and move fighter in that direction.
        // up          - start jump sequence
        // space       - start the fight sequence
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
                fighter.progress = 100;
            fighter.action = nextAction;
            fighter.refreshToPhysics();

            // remember that an input was applied on this turn
            this.inputApplied = true;
        }
    }

    // logic for every game step
    moveAll(stepInfo) {

        if (stepInfo.isReenact)
            return;

        // advance animation progress for all fighters
        let fighters = this.world.queryObjects({ instanceType: Fighter });
        for (let f1 of fighters) {

            // if no input applied and we were running, switch to idle
            if (!this.inputApplied && f1.action === Fighter.ACTIONS.indexOf('RUN'))
                f1.action = Fighter.ACTIONS.indexOf('IDLE');

            // update action progress
            f1.progress -= 3;
            if (f1.progress < 0) {
                f1.progress += 100;

                // end of dying sequence
                if (f1.action === Fighter.ACTIONS.indexOf('DIE'))
                    this.removeObjectFromWorld(f1);

                // if no input applied on this turn, switch to idle
                if (!this.inputApplied)
                    f1.action = Fighter.ACTIONS.indexOf('IDLE');
            }

            // check bounds
            f1.position.x = Math.max(f1.position.x, 0);
            f1.position.x = Math.min(f1.position.x, this.spaceWidth - this.fighterWidth);
        }

        // reset the inputApplied test
        this.inputApplied = false;
    }

    // create fighter
    addFighter(playerId) {
        let f = new Fighter(this, null, { playerId, position: this.randomPosition() });
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
        let p = new Platform(this, null, { playerId: 0, position: new TwoVector(desc.x, desc.y) });
        p.width = desc.width;
        p.height = 10;
        p.isStatic = 1;
        this.addObjectToWorld(p);
        return p;
    }

    // random position for new object
    randomPosition() {
        return new TwoVector(this.spaceWidth / 4 + Math.random() * this.spaceWidth/2, 70);
    }
}
