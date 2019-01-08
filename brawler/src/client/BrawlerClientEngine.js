import ClientEngine from 'lance/ClientEngine';
import BrawlerRenderer from '../client/BrawlerRenderer';
import KeyboardControls from 'lance/controls/KeyboardControls';

export default class BrawlerClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options, BrawlerRenderer);

        // show try-again button
        gameEngine.on('objectDestroyed', (obj) => {
            if (obj.playerId === gameEngine.playerId) {
                document.body.classList.add('lostGame');
                document.querySelector('#tryAgain').disabled = false;
            }
        });

        // restart game
        document.querySelector('#tryAgain').addEventListener('click', () => {
            window.location.reload();
        });

        this.controls = new KeyboardControls(this);
        this.controls.bindKey('up', 'up', { repeat: true } );
        this.controls.bindKey('down', 'down', { repeat: true } );
        this.controls.bindKey('left', 'left', { repeat: true } );
        this.controls.bindKey('right', 'right', { repeat: true } );
        this.controls.bindKey('space', 'space');
    }


}
