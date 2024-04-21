import { ClientEngine, KeyboardControls, ExtrapolateStrategy, ExtrapolateSyncStrategyOptions, FrameSyncStrategy } from 'lance-gg';
import AsteroidsRenderer from './AsteroidsRenderer.js';

const betaTiltThreshold = 40;
const gammaTiltThreshold = 40;
const steerThreshold = 0.4;

const extrapolateSyncStrategyOptions = {
    localObjBending: 0.8,
    remoteObjBending: 1.0,
    bendingIncrements: 6 
}

export default class AsteroidsClientEngine extends ClientEngine {

    private actions: Set<string>;
    private fireButton: any;
    private boostButton: any;
    private controls: KeyboardControls;

    constructor(gameEngine, options) {
        super(gameEngine, new FrameSyncStrategy({}), options, new AsteroidsRenderer(gameEngine));

        //  Game input
        if (isTouchDevice()) {
            document.querySelector('#instructionsMobile')!.classList.remove('hidden');

            this.actions = new Set();

            this.fireButton = document.querySelector('.fireButton');
            this.fireButton.style.opacity = 1;
            this.boostButton = document.querySelector('.boostButton');
            this.boostButton.style.opacity = 1;
            window.addEventListener('deviceorientation', this.handleOrientation.bind(this));
            this.fireButton.addEventListener('touchstart', this.handleButton.bind(this, 'space'), false);
            this.boostButton.addEventListener('touchstart', this.handleButton.bind(this, 'up'), false);
            this.gameEngine.on('client__preStep', this.preStep.bind(this));
        } else {
            document.querySelector('#instructions')!.classList.remove('hidden');
            this.controls = new KeyboardControls(this);
            this.controls.bindKey('ArrowUp', 'ArrowUp', { repeat: true } );
            this.controls.bindKey('ArrowDown', 'ArrowDown', { repeat: true } );
            this.controls.bindKey('ArrowLeft', 'ArrowLeft', { repeat: true } );
            this.controls.bindKey('ArrowRight', 'ArrowRight', { repeat: true } );
            this.controls.bindKey('Space', 'Space');
        }
    }

    handleButton(action, ev) {
        this.actions.add(action);
        ev.preventDefault();
    }

    handleOrientation(event) {
        let isPortrait = window.innerHeight > window.innerWidth;
        let beta = event.beta;  // In degree in the range [-180,180]
        let gamma = event.gamma; // In degree in the range [-90,90]
        let flip = gamma > 0;
        let steerValue = Math.max(-1, Math.min(1, beta / betaTiltThreshold)) * (flip?-1:1);
        if (isPortrait) {
            flip = beta < 0;
            steerValue = Math.max(-1, Math.min(1, gamma / gammaTiltThreshold)) * (flip?-1:1);
        }

        this.actions.delete('left');
        this.actions.delete('right');
        if (steerValue < -steerThreshold) this.actions.add('left');
        else if (steerValue > steerThreshold) this.actions.add('right');
    }

    // our pre-step is to process inputs that are "currently pressed" during the game step
    preStep() {
        this.actions.forEach((action) => this.sendInput(action, { movement: true }));
        this.actions = new Set();
    }
}

function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
}
