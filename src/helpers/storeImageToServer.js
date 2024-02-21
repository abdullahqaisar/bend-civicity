const path = require('path');
var fs = require('fs');
var fs = require('fs-extra');

module.exports.storeImage = async (fileName, buffer, Dir) => {
  console.log(`Buffer is ${buffer}`);
  const trimBuffer = await Buffer.from(buffer.split('base64,')[1], 'base64');
  fileurl = path.join(Dir, fileName);
  await fs.outputFile(fileurl, trimBuffer, { encoding: 'base64' }, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`${fileName} uploaded`);
    }
  });
  const url = String(fileurl);
  return url;
};
