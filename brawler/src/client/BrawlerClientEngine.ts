import { ClientEngine, ExtrapolateStrategy, KeyboardControls } from 'lance-gg';
import BrawlerRenderer from './BrawlerRenderer.js';

const extrapolateSyncStrategyOptions = {
    localObjBending: 0.8,
    remoteObjBending: 1.0,
    bendingIncrements: 6 
}

export default class BrawlerClientEngine extends ClientEngine {

    private controls: KeyboardControls;

    constructor(gameEngine, options) {
        super(gameEngine, new ExtrapolateStrategy(extrapolateSyncStrategyOptions), options, new BrawlerRenderer(gameEngine));

        // show try-again button
        gameEngine.on('objectDestroyed', (obj) => {
            if (obj.playerId === gameEngine.playerId) {
                document.body.classList.add('lostGame');
                (<HTMLButtonElement> document.querySelector('#tryAgain')!).disabled = false;
            }
        });

        // remove instructions
        setTimeout(() => {
            document.querySelector('#instructions')!.classList.add('hidden');
        }, 5000);

        // restart game
        document.querySelector('#tryAgain')!.addEventListener('click', () => {
            window.location.reload();
        });

        this.controls = new KeyboardControls(this);
        this.controls.bindKey('ArrowUp', 'ArrowUp', { repeat: true } );
        this.controls.bindKey('ArrowDown', 'ArrowDown', { repeat: true } );
        this.controls.bindKey('ArrowLeft', 'ArrowLeft', { repeat: true } );
        this.controls.bindKey('ArrowRight', 'ArrowRight', { repeat: true } );
        this.controls.bindKey('Space', 'Space');
    }


}
