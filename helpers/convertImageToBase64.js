const fs = require('fs');

module.exports.convertImage = async (image) => {
  const buffer = await fs.readFileSync(image, 'base64');
  return buffer;
};
