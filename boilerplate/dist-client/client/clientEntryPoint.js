import MyGameEngine from '../common/MyGameEngine.js';
import { Lib } from 'lance-gg';
import MyClientEngine from './MyClientEngine.js';
// default options, overwritten by query-string options
// is sent to both game engine and client engine
const defaults = {
    traceLevel: Lib.Trace.TRACE_NONE,
    delayInputCount: 5,
    scheduler: 'render-schedule'
};
// create a client engine and a game engine
const gameEngine = new MyGameEngine(defaults);
const clientEngine = new MyClientEngine(gameEngine, defaults);
document.addEventListener('DOMContentLoaded', function (e) { clientEngine.start(); });
