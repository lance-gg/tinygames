import { ClientEngine, ClientEngineOptions, ExtrapolateStrategy, KeyboardControls, Renderer } from 'lance-gg';
import MyGameEngine from '../common/MyGameEngine.js';

const extrapolateSyncStrategyOptions = {
    localObjBending: 0.8,
    remoteObjBending: 1.0,
    bendingIncrements: 6 
}

export default class MyClientEngine extends ClientEngine {

    private controls: KeyboardControls;

    constructor(gameEngine: MyGameEngine, options: ClientEngineOptions) {
        super(gameEngine, new ExtrapolateStrategy(extrapolateSyncStrategyOptions), options, new Renderer(gameEngine));

        this.controls = new KeyboardControls(this);
        this.controls.bindKey('ArrowUp', 'ArrowUp', { repeat: true } );
        this.controls.bindKey('ArrowDown', 'ArrowDown', { repeat: true } );
        this.controls.bindKey('ArrowLeft', 'ArrowLeft', { repeat: true } );
        this.controls.bindKey('ArrowRight', 'ArrowRight', { repeat: true } );
        this.controls.bindKey('Space', 'Space');
    }


}
