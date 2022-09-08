const path = require("path");
var fs = require("fs");
var fs = require("fs-extra");

module.exports.storeImage = function (fileName, buffer, Dir) {
  const trimBuffer = Buffer.from(buffer.split("base64,")[1], "base64");
  fileurl = path.join(Dir, fileName);
  fs.outputFile(fileurl, trimBuffer, { encoding: "base64" }, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log(fileName + " uploaded");
    }
  });
  const url = String(fileurl);
  return url;
};
