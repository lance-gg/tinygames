import ServerEngine from 'lance/ServerEngine';
import Fighter from '../common/Fighter';

let game = null;

export default class BrawlerServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
        game = gameEngine;
        game.on('postStep', this.postStep.bind(this));
    }

    start() {
        super.start();

        // add floor
        game.addPlatform({ x: 0, y: 0, width: 160 });

        // add platforms
        game.addPlatform({ x: 10, y: 25, width: 20 });
        game.addPlatform({ x: 50, y: 35, width: 20 });
        game.addPlatform({ x: 90, y: 35, width: 20 });
        game.addPlatform({ x: 130, y: 25, width: 20 });

        // add AI fighters
        // TODO: add AI logic - currently not implemented
        this.aiFighters = [];
        for (let i = 0; i < game.aiCount; i++) {
            let f = game.addFighter(0);
            f.AI = true;
            this.aiFighters.push(f);
        }
    }

    // check if fighter f1 killed f2
    checkKills(f1, f2) {

        if (f1.action !== Fighter.ACTIONS.indexOf('FIGHT')) return;

        let dx = Math.abs(f1.position.x - f2.position.x);
        let dy = Math.abs(f1.position.y - f2.position.y);
        if (f2 !== f1 && f2.action !== Fighter.ACTIONS.indexOf('DIE') &&
            dx <= game.killDistance && dy <= game.killDistance) {
            f2.action = Fighter.ACTIONS.indexOf('DIE');
            f2.progress = 100;
        }
    }

    // handle fighter state change
    updateFighterAction(f1) {

        // if no input applied and we were running, switch to idle
        let inputApplied = game.inputsApplied.indexOf(f1.playerId) >= 0;
        if (!inputApplied && f1.action === Fighter.ACTIONS.indexOf('RUN'))
            f1.action = Fighter.ACTIONS.indexOf('IDLE');

        // end-of-action handling
        if (f1.progress === 0) {
            f1.progress = 100;

            // end of dying sequence
            if (f1.action === Fighter.ACTIONS.indexOf('DIE')) {
                game.removeObjectFromWorld(f1);
                return;
            }

            // if no input applied on this turn, switch to idle
            if (!inputApplied)
                f1.action = Fighter.ACTIONS.indexOf('IDLE');
        }
    }

    // post-step state transitions
    postStep() {

        let fighters = game.world.queryObjects({ instanceType: Fighter });
        for (let f1 of fighters) {

            // updates to action, and check bounds
            this.updateFighterAction(f1);
            f1.position.x = Math.max(f1.position.x, 0);
            f1.position.x = Math.min(f1.position.x, game.spaceWidth - game.fighterWidth);

            // check for kills
            for (let f2 of fighters) this.checkKills(f1, f2);
        }

        // reset input list
        game.inputsApplied = [];
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);
        game.addFighter(socket.playerId);
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);
        for (let o of game.world.queryObjects({ playerId }))
            game.removeObjectFromWorld(o.id);
    }
}
