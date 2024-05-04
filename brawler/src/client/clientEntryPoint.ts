import { Lib } from 'lance-gg';
import BrawlerGameEngine from '../common/BrawlerGameEngine.js';
import BrawlerClientEngine from './BrawlerClientEngine.js';

// default options, overwritten by query-string options
// is sent to both game engine and client engine
const defaults = {
    traceLevel: Lib.Trace.TRACE_NONE,
    delayInputCount: 5,
    scheduler: 'render-schedule'
};

// create a client engine and a game engine
const gameEngine = new BrawlerGameEngine(defaults);
const clientEngine = new BrawlerClientEngine(gameEngine, defaults);

document.addEventListener('DOMContentLoaded', function(e) { clientEngine.start(); });
