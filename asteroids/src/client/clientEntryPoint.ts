import querystring from 'query-string';
import { Lib } from 'lance-gg';
import AsteroidsGameEngine from '../common/AsteroidsGameEngine.js';
import AsteroidsClientEngine from './AsteroidsClientEngine.js';
const qsOptions = querystring.parse(location.search);

// default options, overwritten by query-string options
// is sent to both game engine and client engine
const defaults = {
    traceLevel: Lib.Trace.TRACE_NONE,
    delayInputCount: 5,
    scheduler: 'render-schedule',
    syncOptions: {
        localObjBending: 0.8,
        remoteObjBending: 1.0,
        bendingIncrements: 6
    }
};
let options = Object.assign(defaults, qsOptions);

// create a client engine and a game engine
const gameEngine = new AsteroidsGameEngine(options);
const clientEngine = new AsteroidsClientEngine(gameEngine, options);

document.addEventListener('DOMContentLoaded', function(e) { clientEngine.start(); });
