const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "XUMBhBaK#BeztE3lhogCpPSBxTODTf9zVqXc4COnjRpw0mgqQF8c",
  MONGODB: process.env.MONGODB || "mongodb://mongo:VZxyGSYHVScPOgzxZBZBHPVqSrJqETkw@switchback.proxy.rlwy.net:22850",
  OWNER_NUM: process.env.OWNER_NUM || "94743826406",
};
