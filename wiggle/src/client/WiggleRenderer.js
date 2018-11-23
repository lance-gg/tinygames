import Renderer from 'lance/render/Renderer';
import Wiggle from '../common/Wiggle';
import Food from '../common/Food';

let ctx = null;
let canvas = null;
let game = null;

export default class WiggleRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        game = gameEngine;
        canvas = document.createElement('canvas');
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        document.body.insertBefore(canvas, document.getElementById('logo'));
        game.w = canvas.width;
        game.h = canvas.height;
        game.zoom = game.h / game.spaceHeight;
        if (game.w / game.spaceWidth < game.zoom) game.zoom = game.w / game.spaceWidth;
        ctx = canvas.getContext('2d');
        ctx.lineWidth = 2 / game.zoom;
        ctx.strokeStyle = ctx.fillStyle = 'white';

    }

    draw(t, dt) {
        super.draw(t, dt);

        // Clear the canvas
        ctx.clearRect(0, 0, game.w, game.h);

        // Transform the canvas
        // Note that we need to flip the y axis since Canvas pixel coordinates
        // goes from top to bottom, while physics does the opposite.
        ctx.save();
        ctx.translate(game.w/2, game.h/2); // Translate to the center
        ctx.scale(game.zoom, -game.zoom);  // Zoom in and flip y axis

        // Draw all things
        game.world.forEachObject((id, obj) => {
            if (obj instanceof Wiggle) this.drawWiggle(obj);
            else if (obj instanceof Food) this.drawFood(obj);
        });

        ctx.restore();

    }

    drawWiggle(w) {
        let x = w.position.x;
        let y = w.position.y;
        this.drawCircle(x, y, game.headRadius, true);
        for (let i = 0; i < w.bodyParts.length; i++) {
            let nextPos = w.bodyParts[i];
            this.drawCircle(nextPos.x, nextPos.y, game.bodyRadius, true);
        }
    }

    drawFood(f) {
        this.drawCircle(f.position.x, f.position.y, game.foodRadius, false);
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
