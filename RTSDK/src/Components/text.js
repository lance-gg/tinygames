// import { InteractiveAsset, World } from "../../space-shooter/rtsdk";

export const createText = async ({
  InteractiveAsset,
  pos,
  req,
  text,
  textColor,
  textSize,
  textWidth,
  uniqueName,
  urlSlug,
}) => {
  try {
    const textAsset = await InteractiveAsset({
      id: "rXLgzCs1wxpx96YLZAN5", // Text asset ID
      req,
      position: pos,
      uniqueName,
      urlSlug,
    });

    await textAsset.updateCustomTextAsset(
      {
        textColor, // Color the currently playing track a different color
        textFontFamily: "Arial",
        textSize,
        textWeight: "normal",
        textWidth,
      },
      text,
    );
    return textAsset;
  } catch (e) {
    console.log("Error creating text", e.data.errors || e);
  }
};

export const updateText = ({ World, req, text, textOptions = {}, uniqueName }) => {
  return new Promise(async (res, rej) => {
    const { urlSlug } = req.body;

    try {
      if (!uniqueName) return;
      const world = World.create(urlSlug, { credentials: req.body });

      const droppedAssets = await world.fetchDroppedAssetsWithUniqueName({
        uniqueName,
      });

      if (droppedAssets && droppedAssets[0]) {
        await droppedAssets[0].updateCustomTextAsset(textOptions, text);
        res();
        // await droppedAssets[0].updateDroppedAssetDataObject(newDataObject);
      } else {
        throw "No dropped asset found";
      }
    } catch (e) {
      // Don't need this console log.  Include it for dx, but it'll hit pretty frequently.
      // console.log("Error updating text", e);
      console.log("Error updating text", e.data.errors || e);
      rej();
    }
  });
};
