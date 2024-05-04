import { Lib } from 'lance-gg';
import AsteroidsGameEngine from '../common/AsteroidsGameEngine.js';
import AsteroidsClientEngine from './AsteroidsClientEngine.js';
// default options, overwritten by query-string options
// is sent to both game engine and client engine
const defaults = {
    traceLevel: Lib.Trace.TRACE_NONE,
    delayInputCount: 5,
    scheduler: 'render-schedule'
};
// create a client engine and a game engine
const gameEngine = new AsteroidsGameEngine(defaults);
const clientEngine = new AsteroidsClientEngine(gameEngine, defaults);
document.addEventListener('DOMContentLoaded', function (e) { clientEngine.start(); });
