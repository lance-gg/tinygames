import ClientEngine from 'lance/ClientEngine';
import WiggleRenderer from '../client/WiggleRenderer';

export default class WiggleClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options, WiggleRenderer);
        this.mouseX = null;
        this.mouseY = null;

        document.addEventListener('mousemove', this.updateMouseXY.bind(this), false);
        document.addEventListener('mouseenter', this.updateMouseXY.bind(this), false);
        this.gameEngine.on('client__preStep', this.sendMouseAngle.bind(this));
    }

    updateMouseXY(e) {
        this.mouseX = e.pageX;
        this.mouseY = e.pageY;
    }

    sendMouseAngle() {
        let player = this.gameEngine.world.queryObject({ playerId: this.gameEngine.playerId });
        if (this.mouseY === null || player === null) return;

        let mouseX = (this.mouseX - document.body.clientWidth/2) / this.zoom;
        let mouseY = (this.mouseY - document.body.clientHeight/2) / this.zoom;

        let angle = Math.atan2(mouseY - player.position.y, mouseX - player.position.x);
        this.sendInput(String(angle), { movement: true });
    }

}
