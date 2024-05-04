import { BruteForceCollisionDetectionOptions, GameEngine, GameEngineOptions, InputDesc, SimplePhysicsEngine, TwoVector } from 'lance-gg';
import Fighter from './Fighter.js';
import Platform from './Platform.js';

export default class BrawlerGameEngine extends GameEngine {
    public inputsApplied: number[];
    public walkSpeed = 0.6;
    public dinoCount = 2;
    public spaceWidth = 160;
    public spaceHeight = 90;
    public fighterWidth = 7; 
    private fighterHeight = 12; 
    public jumpSpeed = 1.5;
    public killDistance = 18;
    public dinoKillDistance = 12;
    public platformUnit = 8;
    private platformHeight = 5;

    constructor(options: GameEngineOptions) {
        super(options);

        this.physicsEngine = new SimplePhysicsEngine({
            gameEngine: this,
            gravity: new TwoVector(0, -0.05),
            collisionsType: 'bruteForce',
            collisions: <BruteForceCollisionDetectionOptions> { autoResolve: true },
        });

        this.inputsApplied = [];
        this.on('preStep', this.moveAll.bind(this));
    }

    registerClasses(serializer: Serializer) {
        serializer.registerClass(Platform);
        serializer.registerClass(Fighter);
    }

    processInput(inputData: InputDesc, playerId: number, isServer: boolean) {

        super.processInput(inputData, playerId, isServer);

        // handle keyboard presses:
        // right, left - set direction and move fighter in that direction.
        // up          - start jump sequence
        // space       - start the fight sequence
        let fighter = <Fighter> this.world.queryOneObject({ playerId: playerId, instanceType: Fighter });
        if (fighter) {

            // if fighter is dying or fighting, ignore actions
            if (fighter.action === Fighter.ACTIONS.DIE ||
                fighter.action === Fighter.ACTIONS.FIGHT) {
                return;
            } else if (fighter.action === Fighter.ACTIONS.JUMP) {
                // else fighter is jumping, so fighter can move
                if (inputData.input === 'ArrowRight') {
                    fighter.position.x += this.walkSpeed;
                    fighter.direction = 1;
                } else if (inputData.input === 'ArrowLeft') {
                    fighter.position.x -= this.walkSpeed;
                    fighter.direction = -1;
                }
            } else {
                // else fighter is either idle, or running
                let nextAction: number;
                if (inputData.input === 'ArrowRight') {
                    fighter.position.x += this.walkSpeed;
                    fighter.direction = 1;
                    nextAction = Fighter.ACTIONS.RUN;
                } else if (inputData.input === 'ArrowLeft') {
                    fighter.position.x -= this.walkSpeed;
                    fighter.direction = -1;
                    nextAction = Fighter.ACTIONS.RUN;
                } else if (inputData.input === 'ArrowUp') {
                    if (fighter.velocity.length() === 0)
                        fighter.velocity.y = this.jumpSpeed;
                    nextAction = Fighter.ACTIONS.JUMP;
                } else if (inputData.input === 'Space') {
                    nextAction = Fighter.ACTIONS.FIGHT;
                } else {
                    nextAction = Fighter.ACTIONS.IDLE;
                }
                if (fighter.action !== nextAction)
                    fighter.progress = 99;
                fighter.action = nextAction;
            }
            // update physics, and remember that an input was applied on this turn
            fighter.refreshToPhysics();
            this.inputsApplied.push(playerId);
        }
    }

    // logic for every game step
    moveAll(stepInfo: PreStepDesc) {

        if (stepInfo.isReenact)
            return;

        // advance animation progress for all fighters
        let fighters = <Fighter[]>this.world.queryObjects({ instanceType: Fighter });

        // update action progress
        for (let f1 of fighters) {
            f1.progress -= 6;
            if (f1.progress < 0) f1.progress = 0;

            // stop jumps
            if (f1.action === Fighter.ACTIONS.JUMP &&
                f1.velocity.y === 0) {
                f1.action = Fighter.ACTIONS.IDLE;
            }
        }
    }

    // create fighter
    addFighter(playerId) {
        let f = new Fighter(this, {}, { 
            position: this.randomPosition(),
            width: this.fighterWidth,
            height: this.fighterHeight,
            playerId
        });
        f.kills = 0;
        this.addObjectToWorld(f);
        return f;
    }

    // create a platform
    addPlatform(desc) {
        let p = new Platform(this, { id: 0 }, { 
            position: new TwoVector(desc.x, desc.y),
            width: desc.width,
            height: this.platformHeight,
            isStatic: 1
        });
        this.addObjectToWorld(p);
        return p;
    }

    // random position for new object
    randomPosition() {
        return new TwoVector(this.spaceWidth / 4 + Math.random() * this.spaceWidth/2, 70);
    }
}
