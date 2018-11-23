import ClientEngine from 'lance/ClientEngine';
import AsteroidsRenderer from '../client/AsteroidsRenderer';
import KeyboardControls from 'lance/controls/KeyboardControls';

export default class AsteroidsClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options, AsteroidsRenderer);

        this.controls = new KeyboardControls(this);
        this.controls.bindKey('up', 'up', { repeat: true } );
        this.controls.bindKey('down', 'down', { repeat: true } );
        this.controls.bindKey('left', 'left', { repeat: true } );
        this.controls.bindKey('right', 'right', { repeat: true } );
        this.controls.bindKey('space', 'space');
    }

}
