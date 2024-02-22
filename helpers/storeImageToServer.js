const path = require('path');
const fs = require('fs');

module.exports.storeImage = async (fileName, buffer, Dir) => {
  const trimBuffer = await Buffer.from(buffer.split('base64,')[1], 'base64');
  const fileurl = path.join(Dir, fileName);
  await fs.outputFile(fileurl, trimBuffer, { encoding: 'base64' }, (err) => {
    setTimeout(() => {
      if (err) {
        throw err;
      }
    }, 1000);
  });
  const url = String(fileurl);
  return url;
};
