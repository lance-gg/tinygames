"use strict";

var _queryString = _interopRequireDefault(require("query-string"));

var _Game = _interopRequireDefault(require("../common/Game"));

var _lanceGg = require("lance-gg");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var qsOptions = _queryString.default.parse(location.search); // default options, overwritten by query-string options
// is sent to both game engine and client engine


var defaults = {
  traceLevel: _lanceGg.Lib.Trace.TRACE_NONE,
  delayInputCount: 3,
  scheduler: 'render-schedule',
  syncOptions: {
    sync: qsOptions.sync || 'extrapolate',
    remoteObjBending: 0.8,
    bendingIncrements: 6
  }
};
var options = Object.assign(defaults, qsOptions); // create a client engine and a game engine

var gameEngine = new _Game.default(options);
var clientEngine = new _lanceGg.ClientEngine(gameEngine, options, _lanceGg.Renderer);
document.addEventListener('DOMContentLoaded', function (e) {
  clientEngine.start();
});
//# sourceMappingURL=clientEntryPoint.js.map