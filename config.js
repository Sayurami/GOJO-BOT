const fs = require("fs");
if (fs.existsSync("config.env")) require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}

module.exports = {
  // Session config
  SESSION_ID: process.env.SESSION_ID || "XUMBhBaK#BeztE3lhogCpPSBxTODTf9zVqXc4COnjRpw0mgqQF8c",

  // Owner settings
  OWNER_NUM: process.env.OWNER_NUM || "94743826406",
  OWNER_NAME: process.env.OWNER_NAME || "Gojo Bot Dev",

  // Bot settings
  BOT_NAME: process.env.BOT_NAME || "GOJO MAX",
  PREFIX: process.env.PREFIX || ".",
  MODE: process.env.MODE || "public", // public, private, groups, inbox

  // Alive message
  ALIVE_MSG: process.env.ALIVE_MSG || "Hey, I'm online and ready! Powered by GOJO MAX.",
  ALIVE_IMG: process.env.ALIVE_IMG || "https://raw.githubusercontent.com/gojo7668/Bot-photo-/refs/heads/main/file_00000000085461f8bf4e8572ec9ed5f2%20(1).png",
  ALIVE_VOICE: process.env.ALIVE_VOICE || "https://github.com/Gojo899/Bot-photo-and-video-/raw/refs/heads/main/mp3/1747630063493150813rf60n6vl-voicemaker.in-speech.mp3",

  // Feature toggles
  AUTO_REACT: convertToBool(process.env.AUTO_REACT, "true"),
  AUTO_READ: convertToBool(process.env.AUTO_READ, "false"),
  ANTI_CALL: convertToBool(process.env.ANTI_CALL, "true"),
  BLOCK_BAD_WORDS: convertToBool(process.env.BLOCK_BAD_WORDS, "false"),

  // Developer mode
  DEBUG_MODE: convertToBool(process.env.DEBUG_MODE, "false"),

  // MongoDB URL
  MONGO_URL: process.env.MONGO_URL || "", // Add your MongoDB connection string in config.env
};
