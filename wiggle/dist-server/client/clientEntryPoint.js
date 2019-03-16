"use strict";

var _queryString = _interopRequireDefault(require("query-string"));

var _lanceGg = require("lance-gg");

var _WiggleClientEngine = _interopRequireDefault(require("../client/WiggleClientEngine"));

var _WiggleGameEngine = _interopRequireDefault(require("../common/WiggleGameEngine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var qsOptions = _queryString.default.parse(location.search); // default options, overwritten by query-string options
// is sent to both game engine and client engine


var defaults = {
  traceLevel: _lanceGg.Lib.Trace.TRACE_NONE,
  delayInputCount: 5,
  scheduler: 'render-schedule',
  syncOptions: {
    sync: qsOptions.sync || 'extrapolate',
    localObjBending: 0.8,
    remoteObjBending: 0.8,
    bendingIncrements: 6
  }
};
var options = Object.assign(defaults, qsOptions); // create a client engine and a game engine

var gameEngine = new _WiggleGameEngine.default(options);
var clientEngine = new _WiggleClientEngine.default(gameEngine, options);
document.addEventListener('DOMContentLoaded', function (e) {
  clientEngine.start();
});
//# sourceMappingURL=clientEntryPoint.js.map