import { GameEngine, BaseTypes, TwoVector, DynamicObject, SimplePhysicsEngine, InputDesc, ClientEngine } from 'lance-gg';

const PADDING = 20;
const WIDTH = 400;
const HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 50;

// A paddle has a health attribute
class Paddle extends DynamicObject {
    public health: number = 0;

    netScheme() {
        return Object.assign({
            health: { type: BaseTypes.Int16 }
        }, super.netScheme());
    }

    syncTo(other: Paddle) {
        super.syncTo(other);
        this.health = other.health;
    }
}

// a game object to represent the ball
class Ball extends DynamicObject {

    // avoid gradual synchronization of velocity
    get bending() {
        return { velocity: { percent: 0.0 } };
    }

    syncTo(other: Ball) {
        super.syncTo(other);
    }
}

export default class Game extends GameEngine {

    constructor(options) {
        super(options);

        this.physicsEngine = new SimplePhysicsEngine({ gameEngine: this });

        // common code
        this.on('postStep', this.gameLogic.bind(this));

        // server-only code
        this.on('server__init', this.serverSideInit.bind(this));
        this.on('server__playerJoined', this.serverSidePlayerJoined.bind(this));
        this.on('server__playerDisconnected', this.serverSidePlayerDisconnected.bind(this));

        // client-only code
        this.on('client__draw', this.clientSideDraw.bind(this));
    }

    registerClasses(serializer) {
        serializer.registerClass(Paddle);
        serializer.registerClass(Ball);
    }

    gameLogic() {
        let paddles = <Paddle[]> this.world.queryObjects({ instanceType: Paddle });
        let ball = <Ball> this.world.queryOneObject({ instanceType: Ball });
        if (!ball || paddles.length !== 2) return;

        // CHECK LEFT EDGE:
        if (ball.position.x <= PADDING + PADDLE_WIDTH &&
            ball.position.y >= paddles[0].y && ball.position.y <= paddles[0].position.y + PADDLE_HEIGHT &&
            ball.velocity.x < 0) {

            // ball moving left hit player 1 paddle
            ball.velocity.x *= -1;
            ball.position.x = PADDING + PADDLE_WIDTH + 1;
        } else if (ball.position.x <= 0) {

            // ball hit left wall
            ball.velocity.x *= -1;
            ball.position.x = 0;
            console.log(`player 2 scored`);
            paddles[0].health--;
        }

        // CHECK RIGHT EDGE:
        if (ball.position.x >= WIDTH - PADDING - PADDLE_WIDTH &&
            ball.position.y >= paddles[1].position.y && ball.position.y <= paddles[1].position.y + PADDLE_HEIGHT &&
            ball.velocity.x > 0) {

            // ball moving right hits player 2 paddle
            ball.velocity.x *= -1;
            ball.position.x = WIDTH - PADDING - PADDLE_WIDTH - 1;
        } else if (ball.position.x >= WIDTH ) {

            // ball hit right wall
            ball.velocity.x *= -1;
            ball.position.x = WIDTH - 1;
            console.log(`player 1 scored`);
            paddles[1].health--;
        }

        // ball hits top or bottom edge
        if (ball.position.y <= 0) {
            ball.position.y = 1;
            ball.velocity.y *= -1;
        } else if (ball.position.y >= HEIGHT) {
            ball.position.y = HEIGHT - 1;
            ball.velocity.y *= -1;
        }
    }

    processInput(inputData: InputDesc, playerId: number, isServer: boolean) {
        super.processInput(inputData, playerId, isServer);

        // get the player paddle tied to the player socket
        let playerPaddle = <Paddle> this.world.queryOneObject({ playerId });
        if (playerPaddle) {
            if (inputData.input === 'ArrowUp') {
                playerPaddle.position.y -= 5;
            } else if (inputData.input === 'ArrowDown') {
                playerPaddle.position.y += 5;
            }
        }
    }

    //
    // SERVER ONLY CODE
    //
    serverSideInit() {
        // create the paddles and the ball
        this.addObjectToWorld(new Paddle(this, {}, { 
            playerId: 0, 
            position: new TwoVector(PADDING, 0),
            velocity: new TwoVector(0, 0),
            width: 0, height: 0, isStatic: 0
        }));
        this.addObjectToWorld(new Paddle(this, {}, { 
            playerId: 0, 
            position: new TwoVector(WIDTH - PADDING, 0),
            velocity: new TwoVector(0, 0),
            width: 0, height: 0, isStatic: 0
        }));
        this.addObjectToWorld(new Ball(this, {}, {
            position: new TwoVector(WIDTH /2, HEIGHT / 2),
            velocity: new TwoVector(2, 2),
            width: 0, height: 0, isStatic: 0
        }));
    }

    // attach newly connected player to next available paddle
    serverSidePlayerJoined(ev) {
        let paddles = <Paddle[]>this.world.queryObjects({ instanceType: Paddle });
        if (paddles[0].playerId === 0) {
            paddles[0].playerId = ev.playerId;
        } else if (paddles[1].playerId === 0) {
            paddles[1].playerId = ev.playerId;
        }
    }

    serverSidePlayerDisconnected(ev) {
        let paddles = <Paddle[]>this.world.queryObjects({ instanceType: Paddle });
        if (paddles[0].playerId === ev.playerId) {
            paddles[0].playerId = 0;
        } else if (paddles[1].playerId === ev.playerId) {
            paddles[1].playerId = 0;
        }
    }

    //
    // CLIENT ONLY CODE
    //
    clientSideDraw() {

        function updateEl(el, obj) {
            let health = obj.health>0?obj.health:15;
            el.style.top = obj.position.y + 10 + 'px';
            el.style.left = obj.position.x + 'px';
            el.style.background = `#ff${health.toString(16)}f${health.toString(16)}f`;
        }

        let paddles = <Paddle[]>this.world.queryObjects({ instanceType: Paddle });
        let ball = <Ball>this.world.queryOneObject({ instanceType: Ball });
        if (!ball || paddles.length !== 2) return;
        updateEl(document.querySelector('.ball'), ball);
        updateEl(document.querySelector('.paddle1'), paddles[0]);
        updateEl(document.querySelector('.paddle2'), paddles[1]);
    }
}
