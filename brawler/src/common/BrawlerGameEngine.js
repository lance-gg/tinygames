import GameEngine from 'lance/GameEngine';
import SimplePhysicsEngine from 'lance/physics/SimplePhysicsEngine';
import TwoVector from 'lance/serialize/TwoVector';
import Fighter from './Fighter';
import Platform from './Platform';

export default class BrawlerGameEngine extends GameEngine {

    constructor(options) {
        super(options);

        this.physicsEngine = new SimplePhysicsEngine({
            gameEngine: this,
            collisions: { type: 'brute' }
        });
        this.on('postStep', this.warpAll.bind(this));
        this.on('collisionStart', this.handleCollision.bind(this));

        // game variables
        Object.assign(this, {
            aiCount: 2,
        });
    }

    // If the body is out of space bounds, warp it to the other side
    warpAll() {
        this.world.forEachObject((id, obj) => {
            let p = obj.position;
            if(p.x > this.spaceWidth/2) p.x = -this.spaceWidth/2;
            if(p.y > this.spaceHeight/2) p.y = -this.spaceHeight/2;
            if(p.x < -this.spaceWidth /2) p.x = this.spaceWidth/2;
            if(p.y < -this.spaceHeight/2) p.y = this.spaceHeight/2;
            obj.refreshToPhysics();
        });
    }

    handleCollision(evt) {
        console.log(`collision: ${evt}`);
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
                if (fighter.velocity.length() !== 0) fighter.velocity.y = 1;
            } else if (inputData.input === 'space') {
                if (fighter.swingAxe === 0) fighter.swingAxe = 10;
            }
        }
    }

    moveAll(stepInfo) {

        if (stepInfo.isReenact)
            return;

        this.world.forEachObject((id, obj) => {
            if (obj instanceof Fighter) {

                if (obj.swingAxe > 0) obj.swingAxe--;

                // if the position changed, add a body part and trim the length
                let pos = obj.position.clone();
                if (obj.bodyParts.length === 0 || pos.subtract(obj.bodyParts[obj.bodyParts.length-1]).length() > 0.05) {
                    obj.bodyParts.push(obj.position.clone());
                    while (obj.bodyLength < obj.bodyParts.length) obj.bodyParts.shift();
                }

                // if not stopped, move along
                if (obj.direction === this.directionStop) return;
                let move = new TwoVector(Math.cos(obj.direction), Math.sin(obj.direction));
                move.multiplyScalar(0.05);
                obj.position.add(move);
                obj.position.y = Math.min(obj.position.y, this.spaceHeight);
                obj.position.y = Math.max(obj.position.y, 0);
                obj.position.x = Math.min(obj.position.x, this.spaceWidth);
                obj.position.x = Math.max(obj.position.x, 0);
            }
        });
    }

    // create fighter
    addFighter(playerId) {
        let f = new Fighter(this, null, {
            playerId: playerId,
            position: this.randomPosition()
        });
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
        this.addObjectToWorld(p);
        return p;
    }

    randomPosition() {
        return new TwoVector(Math.random() * this.spaceWidth, 0);
    }

}
