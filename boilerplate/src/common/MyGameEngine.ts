import { GameEngine, BaseTypes, DynamicObject, SimplePhysicsEngine, InputDesc } from 'lance-gg';

// /////////////////////////////////////////////////////////
//
// GAME OBJECTS
//
// /////////////////////////////////////////////////////////
class MyGameObject extends DynamicObject {

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
    }

    netScheme() {
        return Object.assign({
            health: { type: BaseTypes.Int16 }
        }, super.netScheme());
    }

    syncTo(other: MyGameObject) {
        super.syncTo(other);
    }
}


// /////////////////////////////////////////////////////////
//
// GAME ENGINE
//
// /////////////////////////////////////////////////////////
export default class MyGameEngine extends GameEngine {

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
        this.on('client__rendererReady', this.clientSideInit.bind(this));
        this.on('client__draw', this.clientSideDraw.bind(this));
    }

    registerClasses(serializer) {
        serializer.registerClass(MyGameObject);
    }

    gameLogic() {
    }

    processInput(inputData: InputDesc, playerId: number, isServer: boolean) {
        super.processInput(inputData, playerId, isServer);
    }


    // /////////////////////////////////////////////////////////
    //
    // SERVER ONLY CODE
    //
    // /////////////////////////////////////////////////////////
    serverSideInit() {
    }

    serverSidePlayerJoined(ev) {
    }

    serverSidePlayerDisconnected(ev) {
    }


    // /////////////////////////////////////////////////////////
    //
    // CLIENT ONLY CODE
    //
    // /////////////////////////////////////////////////////////
    clientSideInit() {
    }

    clientSideDraw() {
    }
}
