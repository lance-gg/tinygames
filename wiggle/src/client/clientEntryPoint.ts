import { Lib } from 'lance-gg';
import WiggleGameEngine from '../common/WiggleGameEngine.js';
import WiggleClientEngine from './WiggleClientEngine.js';

// default options, overwritten by query-string options
// is sent to both game engine and client engine
const defaults = {
    traceLevel: Lib.Trace.TRACE_NONE,
    delayInputCount: 5,
    scheduler: 'render-schedule'
}

// create a client engine and a game engine
const gameEngine = new WiggleGameEngine(defaults);
const clientEngine = new WiggleClientEngine(gameEngine, defaults);

document.addEventListener('DOMContentLoaded', function(e) { clientEngine.start(); });
