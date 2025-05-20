const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "SZsmjAaL#5po9EAETJCYT2i8Z0VJ9lh9nvc0vI6oe4pI__Ts6DNc",
  OWNER_NUM: process.env.OWNER_NUM || "94743826406",
};
