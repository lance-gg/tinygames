import { DroppedAsset } from "./index.js";

export const getDroppedAsset = async (req) => {
  const { assetId, interactivePublicKey, interactiveNonce, urlSlug, visitorId } = req.body;

  try {
    // Can do .create instead of .get if you don't need all the data inside the dropped asset
    const droppedAsset = await DroppedAsset.get(assetId, urlSlug, {
      credentials: {
        assetId,
        interactiveNonce,
        interactivePublicKey,
        visitorId,
      },
    });
    return droppedAsset;
  } catch (e) {
    console.log("Error getting asset and data object", e);
  }
};

export const updateTextAsset = async (req, res) => {
  try {
    const { assetId, assetText, urlSlug } = req.body;
    // Doing a create here instead of a .get because don't need all the data inside the dropped asset.
    const droppedAsset = DroppedAsset.create(assetId, urlSlug, {
      credentials: req.body,
    });
    await droppedAsset.updateCustomTextAsset({}, assetText);
    return res.json({ success: true });
  } catch (e) {
    // Don't need this console log.  Include it for dx, but it'll hit pretty frequently.
    // console.log("Error updating text asset", e);
  }
};
