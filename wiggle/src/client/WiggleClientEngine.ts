import { ClientEngine, ClientEngineOptions, ExtrapolateStrategy } from 'lance-gg';
import WiggleRenderer from './WiggleRenderer.js';
import WiggleGameEngine from '../common/WiggleGameEngine.js';
import Wiggle from '../common/Wiggle.js';

const extrapolateSyncStrategyOptions =  {
    localObjBending: 0.8,
    remoteObjBending: 0.8,
    bendingIncrements: 6
}

export default class WiggleClientEngine extends ClientEngine {
    gameEngine: WiggleGameEngine;
    wiggleRenderer: WiggleRenderer;
    mouseX: number;
    mouseY: number;

    constructor(gameEngine: WiggleGameEngine, options: ClientEngineOptions) {
        let renderer = new WiggleRenderer(gameEngine);
        super(gameEngine, new ExtrapolateStrategy(extrapolateSyncStrategyOptions), options, renderer);
        this.gameEngine = gameEngine;
        this.wiggleRenderer = renderer;

        // show try-again button
        gameEngine.on('objectDestroyed', (obj) => {
            if (obj.playerId === gameEngine.playerId) {
                document.body.classList.add('lostGame');
                (<HTMLButtonElement> document.querySelector('#tryAgain')!).disabled = false;
            }
        });

        // restart game
        (<HTMLButtonElement> document.querySelector('#tryAgain')!).addEventListener('click', () => {
            window.location.reload();
        });

        document.addEventListener('mousemove', this.updateMouseXY.bind(this), false);
        document.addEventListener('mouseenter', this.updateMouseXY.bind(this), false);
        document.addEventListener('touchmove', this.updateMouseXY.bind(this), false);
        document.addEventListener('touchenter', this.updateMouseXY.bind(this), false);
        this.gameEngine.on('client__preStep', this.sendMouseAngle.bind(this));
    }

    updateMouseXY(e) {
        e.preventDefault();
        if (e.touches) e = e.touches.item(0);
        this.mouseX = e.pageX;
        this.mouseY = e.pageY;
    }

    sendMouseAngle() {
        let player = <Wiggle> this.gameEngine.world.queryOneObject({ playerId: this.gameEngine.playerId, instanceType: Wiggle });
        if (this.mouseY === null || player === null) return;

        let mouseX = (this.mouseX - document.body.clientWidth/2) / this.wiggleRenderer.zoom;
        let mouseY = (this.mouseY - document.body.clientHeight/2) / this.wiggleRenderer.zoom;
        let dx = mouseY - player.position.y;
        let dy = mouseX - player.position.x;
        if (Math.sqrt(dx * dx + dy * dy) < 0.5) {
            this.sendInput(String(this.gameEngine.directionStop), { movement: true });
            return;
        }

        let angle = Math.atan2(dx, dy);
        this.sendInput(String(angle), { movement: true });
    }
}
