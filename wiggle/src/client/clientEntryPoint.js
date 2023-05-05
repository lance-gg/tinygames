import querystring from "query-string";
import { Lib } from "@rtsdk/lance-topia";
import WiggleClientEngine from "../client/WiggleClientEngine";
import WiggleGameEngine from "../common/WiggleGameEngine";
const qsOptions = querystring.parse(location.search);

// default options, overwritten by query-string options
// is sent to both game engine and client engine
const defaults = {
  traceLevel: Lib.Trace.TRACE_NONE,
  delayInputCount: 5,
  scheduler: "render-schedule",
  //   syncOptions: {
  //     sync: qsOptions.sync || "extrapolate",
  //     // sync: qsOptions.sync || "frameSync",
  //     localObjBending: 0.2,
  //     remoteObjBending: 0.2,
  //     bendingIncrements: 6,
  //   },

  syncOptions: {
    sync: qsOptions.sync || "interpolate",
    localObjBending: 0.6,
    remoteObjBending: 0.6,
    bendingIncrements: 6,
  },
};
let options = Object.assign(defaults, qsOptions);

// create a client engine and a game engine
const gameEngine = new WiggleGameEngine(options);
const clientEngine = new WiggleClientEngine(gameEngine, options);

document.addEventListener("DOMContentLoaded", function (e) {
  clientEngine.start();
});
