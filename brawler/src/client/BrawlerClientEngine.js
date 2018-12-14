import ClientEngine from 'lance/ClientEngine';
import BrawlerRenderer from '../client/BrawlerRenderer';
import KeyboardControls from 'lance/controls/KeyboardControls';

export default class BrawlerClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options, BrawlerRenderer);

        this.controls = new KeyboardControls(this);
        this.controls.bindKey('up', 'up', { repeat: true } );
        this.controls.bindKey('down', 'down', { repeat: true } );
        this.controls.bindKey('left', 'left', { repeat: true } );
        this.controls.bindKey('right', 'right', { repeat: true } );
        this.controls.bindKey('space', 'space');
    }

}
