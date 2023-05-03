import { InteractiveAsset, getAssetAndDataObject, World, Visitor } from "./index.js";

// Pull in TopiaComponents and instantiate with topiaInit so use correct developer key
import {
  hideLeaderboard,
  getRoomAndUsername,
  showLeaderboard,
  updateLeaderboard,
  roomBasedOn,
  // resetLeaderboard,
} from "../../../RTSDKComponents/dist/index.cjs";

export const Leaderboard = {
  show: (props) => showLeaderboard({ ...props, InteractiveAsset, getAssetAndDataObject }),
  hide: (props) => hideLeaderboard({ ...props, World }),
  update: (props) => updateLeaderboard({ ...props, World, getAssetAndDataObject }),
};

export const VisitorInfo = {
  // Payload: { isAdmin, roomName, username }
  // Used to determine if admin and move users to correct roomName based on assetId.  Also pulls their username
  getRoomAndUsername: (props) => getRoomAndUsername({ ...props, Visitor }),
  // Used to specify how we are calculating the room so that query params can be properly matched on front end and backend.
  roomBasedOn: roomBasedOn,
};
