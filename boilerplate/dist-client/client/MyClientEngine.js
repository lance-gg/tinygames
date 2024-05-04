import { ClientEngine, ExtrapolateStrategy, KeyboardControls, Renderer } from 'lance-gg';
const extrapolateSyncStrategyOptions = {
    localObjBending: 0.8,
    remoteObjBending: 1.0,
    bendingIncrements: 6
};
export default class MyClientEngine extends ClientEngine {
    constructor(gameEngine, options) {
        super(gameEngine, new ExtrapolateStrategy(extrapolateSyncStrategyOptions), options, new Renderer(gameEngine));
        this.controls = new KeyboardControls(this);
        this.controls.bindKey('ArrowUp', 'ArrowUp', { repeat: true });
        this.controls.bindKey('ArrowDown', 'ArrowDown', { repeat: true });
        this.controls.bindKey('ArrowLeft', 'ArrowLeft', { repeat: true });
        this.controls.bindKey('ArrowRight', 'ArrowRight', { repeat: true });
        this.controls.bindKey('Space', 'Space');
    }
}
