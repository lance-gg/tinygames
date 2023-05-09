import { InteractiveAsset, getAssetAndDataObject, World, User, Visitor } from "./index.js";

// Pull in TopiaComponents and instantiate with topiaInit so use correct developer key
import {
  hideLeaderboard,
  getRoomAndUsername,
  showLeaderboard,
  updateLeaderboard,
  roomBasedOn,
  showBoard,
  updateBoard,
  hideBoard,
  // saveStat
  // resetLeaderboard,
  // } from "../../../RTSDKComponents/dist/index.cjs";
} from "@rtsdk/topiacomponents/dist/index.cjs";

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
  updateLastVisited: (props) => updateLastVisited({ ...props, Visitor }),
};

export const Stats = {
  saveStat: (props) => saveStat({ ...props, User }),
  incrementStat: (props) => incrementStat({ ...props, User }),
  getStats: (props) => getStats({ ...props, User }),
};

const namePrefix = "multiplayer_statsboard";
const statKeys = [
  "name",
  "level",
  "XP",
  "blocks",
  { blocksPerGame: "Blocks / Game" },
  { foodEaten: "Food Eaten" },
  { foodPerGame: "Food / Game" },
];

export const StatsBoard = {
  show: (props) =>
    showBoard({
      ...props,
      contentWidth: 475,
      distBetweenRows: 25,
      frameId: "ydAK6dqB3w9Q7qqVmSrS",
      keysArray: statKeys,
      namePrefix,
      InteractiveAsset,
      getAssetAndDataObject,
      yOffset: -375,
    }),
  hide: (props) => hideBoard({ ...props, namePrefix, World }),
  update: (props) =>
    updateBoard({
      ...props,
      World,
      getAssetAndDataObject,
      keysArray: statKeys,
      namePrefix,
    }),
};

// TO MOVE TO RTSDK COMPONENTS
// VISITOR
// const getVisitorAndDataObject = async ({ Visitor, query }) => {
//   const { assetId, interactivePublicKey, interactiveNonce, urlSlug, visitorId } = query;
//   try {
//     const visitor = await Visitor.get(visitorId, urlSlug, {
//       credentials: {
//         assetId,
//         interactiveNonce,
//         interactivePublicKey,
//         visitorId,
//       },
//     });
//     if (!visitor || !visitor.username) throw "Not in world";
//     await visitor.fetchVisitorDataObject();
//     return visitor;
//   } catch (e) {
//     // Not actually in the world.  Should prevent from seeing game.
//     if (e && e.data && e.data.errors) console.log("Error getting visitor", e?.data?.errors);
//     else if (e) console.log("Error getting visitor", e);
//   }
// };

const updateLastVisited = async ({ Visitor, query }) => {
  const { assetId, interactivePublicKey, interactiveNonce, urlSlug, visitorId } = query;
  try {
    const visitor = await Visitor.get(visitorId, urlSlug, {
      credentials: {
        assetId,
        interactiveNonce,
        interactivePublicKey,
        visitorId,
      },
    });
    if (!visitor || !visitor.username) throw "Not in world";
    await visitor.updateVisitorDataObject({ lastVisited: Date.now() });
    return visitor;
  } catch (e) {
    // Not actually in the world.  Should prevent from seeing game.
    if (e && e.data && e.data.errors) console.log("Error updating last visited", e?.data?.errors);
    else if (e) console.log("Error updating last visited", e);
  }
};

// USER
const saveStat = async ({ User, profileId, stat }) => {
  // Check whether have access to interactive nonce, which means visitor is in world.
  try {
    const user = await User.create({ profileId });
    const dataObject = await user.fetchUserDataObject();
    const stats = dataObject.stats || {};
    await user.updateUserDataObject({ stats: { ...stats, stat } });
    return user;
  } catch (e) {
    console.log("Error saving stat", e);
  }
};

const incrementStat = async ({ User, profileId, statKey, incrementAmount }) => {
  // Check whether have access to interactive nonce, which means visitor is in world.
  try {
    const user = await User.create({ profileId });
    // const dataObject = await user.fetchUserDataObject();
    await user.fetchUserDataObject();
    const { dataObject } = user;
    const stats = dataObject.stats || {};
    let quantity = stats[statKey] || 0;
    quantity += incrementAmount;
    stats[statKey] = quantity;
    await user.updateUserDataObject({ stats });
    return stats;
  } catch (e) {
    console.log("Error incrementing stat", e);
  }
};

const getStats = async ({ User, profileId }) => {
  try {
    const user = await User.create({ profileId });
    await user.fetchUserDataObject();
    const { dataObject } = user;
    return dataObject.stats;
  } catch (e) {
    console.log("Error getting stats", e);
  }
};
