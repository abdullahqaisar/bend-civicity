const path = require("path");
var fs = require("fs");
var fs = require("fs-extra");

module.exports.convertImage = async (image) => {
  try {
    let buffer = await fs.readFileSync(image, "base64");
    console.log("Convert Buffer is " + buffer);
    return buffer;
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: e.message });
  }
};
