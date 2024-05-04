import { Renderer, TwoVector } from 'lance-gg';
import Wiggle from '../common/Wiggle.js';
import Food from '../common/Food.js';
import WiggleGameEngine from '../common/WiggleGameEngine.js';
import WiggleClientEngine from './WiggleClientEngine.js';

let ctx: CanvasRenderingContext2D;
let canvas: HTMLCanvasElement;
let game: WiggleGameEngine;
let clientEngine: WiggleClientEngine;
let width: number;
let height: number;
let c = 0;

export default class WiggleRenderer extends Renderer {
    zoom: number;

    constructor(gameEngine: WiggleGameEngine) {
        super(gameEngine);
        game = gameEngine;
        clientEngine = <WiggleClientEngine> this.clientEngine;
        canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.insertBefore(canvas, document.getElementById('logo'));
        width = canvas.width;
        height = canvas.height;
        this.zoom = height / game.spaceHeight;
        if (width / game.spaceWidth < this.zoom) this.zoom = width / game.spaceWidth;
        ctx = canvas.getContext('2d')!;
        ctx.lineWidth = 2 / this.zoom;
        ctx.strokeStyle = ctx.fillStyle = 'white';
    }

    draw(t: number, dt: number) {
        super.draw(t, dt);

        // Clear the canvas
        ctx.clearRect(0, 0, width, height);

        // Transform the canvas
        // Note that we need to flip the y axis since Canvas pixel coordinates
        // goes from top to bottom, while physics does the opposite.
        ctx.save();
        ctx.translate(width/2, height/2); // Translate to the center
        ctx.scale(this.zoom, this.zoom);  // Zoom in and flip y axis

        // Draw all things
        let wiggles = (<Wiggle[]> game.world.queryObjects({ instanceType: Wiggle }));
        wiggles.forEach((w) => this.drawWiggle(w));
        let foods = (<Food[]> game.world.queryObjects({ instanceType: Food }));
        foods.forEach((f) => this.drawFood(f));

        ctx.restore();
    }

    rainbowColors() {
        c += 0.005;
        let zeroTo240 = Math.floor((Math.cos(c) + 1) * 120);
        return `rgb(${zeroTo240},100,200)`;
    }

    drawWiggle(w) {

        // draw head and body
        let isPlayer = w.playerId === this.gameEngine.playerId;
        let x = w.position.x;
        let y = w.position.y;
        if (isPlayer) ctx.fillStyle = this.rainbowColors();
        this.drawCircle(x, y, game.headRadius, true);
        for (let i = 0; i < w.bodyParts.length; i++) {
            let nextPos = w.bodyParts[i];
            if (isPlayer) ctx.fillStyle = this.rainbowColors();
            this.drawCircle(nextPos.x, nextPos.y, game.bodyRadius, true);
        }

        // draw eyes
        let angle = +w.direction;
        if (w.direction === game.directionStop) {
            angle = - Math.PI / 2;
        }
        let eye1 = new TwoVector(Math.cos(angle + game.eyeAngle), Math.sin(angle + game.eyeAngle));
        let eye2 = new TwoVector(Math.cos(angle - game.eyeAngle), Math.sin(angle - game.eyeAngle));
        eye1.multiplyScalar(game.eyeDist).add(w.position);
        eye2.multiplyScalar(game.eyeDist).add(w.position);
        ctx.fillStyle = 'black';
        this.drawCircle(eye1.x, eye1.y, game.eyeRadius, true);
        this.drawCircle(eye2.x, eye2.y, game.eyeRadius, true);
        ctx.fillStyle = 'white';

        // update status
        if (isPlayer) {
            document.getElementById('wiggle-length')!.innerHTML = 'Wiggle Length: ' + w.bodyParts.length;
        }
    }

    drawFood(f) {
        ctx.strokeStyle = ctx.fillStyle = 'Orange';
        this.drawCircle(f.position.x, f.position.y, game.foodRadius, true);
        ctx.strokeStyle = ctx.fillStyle = 'White';
    }

    drawCircle(x, y, radius, fill) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2*Math.PI);
        fill?ctx.fill():ctx.stroke();
        ctx.closePath();
    }

    drawBounds() {
        ctx.beginPath();
        ctx.moveTo(-game.spaceWidth/2, -game.spaceHeight/2);
        ctx.lineTo(-game.spaceWidth/2, game.spaceHeight/2);
        ctx.lineTo( game.spaceWidth/2, game.spaceHeight/2);
        ctx.lineTo( game.spaceWidth/2, -game.spaceHeight/2);
        ctx.lineTo(-game.spaceWidth/2, -game.spaceHeight/2);
        ctx.closePath();
        ctx.stroke();
    }

}
