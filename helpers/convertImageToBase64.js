const path = require('path');
var fs = require('fs');
var fs = require('fs-extra');

module.exports.convertImage = async (image) => {
  try {
    const buffer = await fs.readFileSync(image, 'base64');
    debug(`Convert Buffer is ${buffer}`);
    return buffer;
  } catch (e) {
    debug(e.message);
    return res.status(500).json({ error: e.message });
  }
};
