const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "qQtRULDL#F-DxPkbcdUUgcjBOKQ-Fj-UrihZlbhJOf4btLldd8rk",
  OWNER_NUM: process.env.OWNER_NUM || "94743826406",
  PREFIX: process.env.PREFIX || ".",
  AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
  MODE: process.env.MODE || "public",
};
