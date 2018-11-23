import ClientEngine from 'lance/ClientEngine';
import WiggleRenderer from '../client/WiggleRenderer';
import KeyboardControls from 'lance/controls/KeyboardControls';

export default class WiggleClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options, WiggleRenderer);

        this.controls = new KeyboardControls(this);
        this.controls.bindKey('up', 'up', { repeat: true } );
        this.controls.bindKey('down', 'down', { repeat: true } );
        this.controls.bindKey('left', 'left', { repeat: true });
        this.controls.bindKey('right', 'right', { repeat: true });
        this.controls.bindKey('space', 'space');
    }

}
