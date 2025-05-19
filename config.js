const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "iclElTia#phh7-2PQWxbuqnKCXImdepzgYGP_ffk76V7FIL9xEQY",
  MONGODB: process.env.MONGODB || "mongodb://mongo:LdJOaalPaYhfycEcfZsgpucQziFCNPld@shortline.proxy.rlwy.net:50373",
  OWNER_NUM: process.env.OWNER_NUM || "94743826406",
};
