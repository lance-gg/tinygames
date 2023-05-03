import moment from "moment";
// import { getAssetAndDataObject, World } from "../../../space-shooter/rtsdk";
import { createText } from "../text";
import { addFrame } from "../staticAssets";

export const leaderboardLength = 10;

export const showLeaderboard = async ({ InteractiveAsset, assetId, getAssetAndDataObject, req, urlSlug }) => {
  // Check to see if leaderboard already exists.

  const arcadeAsset = await getAssetAndDataObject(req);
  // const arcadeAsset = await getDroppedAsset(req);
  const assetPos = arcadeAsset.position;

  const dataObject = arcadeAsset.dataObject;
  const { highScores } = dataObject;
  // const highScores = null;
  const posOffset = { x: assetPos.x, y: assetPos.y + 400 };

  addFrame({ InteractiveAsset, assetId, pos: posOffset, req, urlSlug });

  // Doing this because we don't yet have layering in SDK.
  setTimeout(() => {
    const createLeaderText = ({ pos, uniqueNameId, text }) => {
      createText({
        InteractiveAsset,
        pos,
        req,
        text: text || "-",
        textColor: "#000000",
        textSize: 12,
        textWidth: 300,
        uniqueName: `multiplayer_leaderboard_${assetId}_${uniqueNameId}_${i}`,
        urlSlug,
      });
    };
    const distBetweenRows = 23;
    const distBetweenColumns = 150;

    for (var i = 0; i < leaderboardLength; i++) {
      // Player Names
      const { x, y } = posOffset;
      const topOfLeaderboard = -10;
      // const topOfLeaderboard = -160;

      createLeaderText({
        pos: { x: x - distBetweenColumns / 2, y: topOfLeaderboard + y + i * distBetweenRows },
        uniqueNameId: `playerName`,
      });

      // Scores
      createLeaderText({
        pos: { x: x + distBetweenColumns / 2, y: topOfLeaderboard + y + i * distBetweenRows },
        uniqueNameId: `score`,
      });
    }

    for (var i = 0; i < 3; i++) {
      // Player Names
      const { x, y } = posOffset;
      const topOfLeaderboard = -125;

      let scoreObj = { name: "-", date: "-", score: "-" };
      let scoreString = "-";
      if (highScores && highScores[i]) {
        scoreObj = highScores[i];
        scoreObj.date = moment(parseInt(highScores[i].date)).fromNow(); // Use moment to format
        scoreString = scoreObj.score.toString() || "0";
      }

      createLeaderText({
        pos: { x: x - distBetweenColumns / 2, y: topOfLeaderboard + y + i * distBetweenRows },
        uniqueNameId: `topPlayerName`,
        text: scoreObj.name,
      });

      createLeaderText({
        pos: { x: x, y: topOfLeaderboard + y + i * distBetweenRows },
        uniqueNameId: `topDate`,
        text: scoreObj.date,
      });

      // Scores
      createLeaderText({
        pos: { x: x + distBetweenColumns / 2, y: topOfLeaderboard + y + i * distBetweenRows },
        uniqueNameId: `topScore`,
        text: scoreString,
      });
    }
  }, 500);
};

export const hideLeaderboard = async ({ World, req }) => {
  const { assetId, urlSlug } = req.body;
  try {
    const world = World.create(urlSlug, { credentials: req.body });
    const droppedAssets = await world.fetchDroppedAssetsWithUniqueName({
      isPartial: true,
      uniqueName: `multiplayer_leaderboard_${assetId}`,
    });
    if (droppedAssets && droppedAssets.length)
      droppedAssets.forEach((droppedAsset) => {
        try {
          droppedAsset.deleteDroppedAsset();
        } catch (e) {
          console.log("Error on delete dropped asset", e);
        }
      });
  } catch (e) {
    console.log("Error removing leaderboard", e?.response?.status || e?.data?.errors);
  }
};

export const resetLeaderboard = () => {
  return;
};
