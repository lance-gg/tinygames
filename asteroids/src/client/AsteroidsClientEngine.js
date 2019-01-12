import ClientEngine from 'lance/ClientEngine';
import AsteroidsRenderer from '../client/AsteroidsRenderer';
import KeyboardControls from 'lance/controls/KeyboardControls';

const betaTiltThreshold = 40;
const gammaTiltThreshold = 40;
const steerThreshold = 0.05;

export default class AsteroidsClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options, AsteroidsRenderer);

        //  Game input
        if (isTouchDevice()) {
            document.querySelector('#instructionsMobile').classList.remove('hidden');

            this.actions = new Set();

            this.fireButton = document.querySelector('.fireButton');
            this.fireButton.style.opacity = 1;
            this.boostButton = document.querySelector('.boostButton');
            this.boostButton.style.opacity = 1;
            window.addEventListener('deviceorientation', this.handleOrientation.bind(this));
            this.fireButton.addEventListener('touchstart', () => this.actions.add('space'), false);
            this.boostButton.addEventListener('touchstart', () => this.actions.add('up'), false);
            this.gameEngine.on('client__preStep', this.preStep.bind(this));
        } else {
            document.querySelector('#instructions').classList.remove('hidden');
            this.controls = new KeyboardControls(this);
            this.controls.bindKey('up', 'up', { repeat: true } );
            this.controls.bindKey('down', 'down', { repeat: true } );
            this.controls.bindKey('left', 'left', { repeat: true } );
            this.controls.bindKey('right', 'right', { repeat: true } );
            this.controls.bindKey('space', 'space');
        }
    }

    handleOrientation(event) {
        let isPortrait = window.innerHeight > window.innerWidth;
        let beta = event.beta;  // In degree in the range [-180,180]
        let gamma = event.gamma; // In degree in the range [-90,90]

        let steerValue;
        if (isPortrait) {
            let flip = beta < 0;
            steerValue = Math.max(-1, Math.min(1, gamma / gammaTiltThreshold)) * (flip?-1:1);
        } else {
            let flip = gamma > 0;
            steerValue = Math.max(-1, Math.min(1, beta / betaTiltThreshold)) * (flip?-1:1);
        }

        // prevent hypesensitive steering on mobile
        // let x = Math.abs(steerValue);
        // let frameStep = Math.round(frameThreshold-x*x*frameThreshold);
        // let shouldSteer = this.renderer.frameNum % frameStep == 0;
        let shouldSteer = true;

        if (shouldSteer) {
            this.actions.delete('left');
            this.actions.delete('right');
            if (steerValue < -steerThreshold) {
                this.actions.add('left');
            } else if (steerValue > steerThreshold) {
                this.actions.add('right');
            }
        }
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
