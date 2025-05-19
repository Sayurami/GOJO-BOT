const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers,
} = require("@whiskeysockets/baileys");

const fs = require("fs");
const axios = require("axios");
const P = require("pino");
const qrcode = require("qrcode-terminal");
const config = require("./config");
const { getBuffer } = require("./lib/functions");
const { sms } = require("./lib/msg");

const ownerNumber = config.OWNER_NUM;
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

async function connectToWA() {
  const { state, saveCreds } = await useMultiFileAuthState(__dirname + "/auth_info_baileys/");
  const { version } = await fetchLatestBaileysVersion();

  const robin = makeWASocket({
    logger: P({ level: "silent" }),
    printQRInTerminal: false,
    browser: Browsers.macOS("Firefox"),
    syncFullHistory: true,
    auth: state,
    version,
  });

  robin.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close" && lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
      connectToWA();
    } else if (connection === "open") {
      console.log("GOJO MAX connected to WhatsApp ✅");

      fs.readdirSync("./plugins/").forEach((file) => {
        if (file.endsWith(".js")) require("./plugins/" + file);
      });

      robin.sendMessage(ownerNumber + "@s.whatsapp.net", {
        image: { url: config.ALIVE_IMG },
        caption: "GOJO MAX connected successfully ✅",
      });
    }
  });

  robin.ev.on("creds.update", saveCreds);

  robin.ev.on("messages.upsert", async (mek) => {
    mek = mek.messages[0];
    if (!mek.message || mek.key?.remoteJid === "status@broadcast") return;

    mek.message = getContentType(mek.message) === "ephemeralMessage"
      ? mek.message.ephemeralMessage.message
      : mek.message;

    const m = sms(robin, mek);
    const type = getContentType(mek.message);
    const from = mek.key.remoteJid;
    const body = type === "conversation"
      ? mek.message.conversation
      : mek.message[type]?.caption || mek.message[type]?.text || "";
    const isCmd = body.startsWith(config.PREFIX);
    const command = isCmd ? body.slice(config.PREFIX.length).trim().split(" ")[0].toLowerCase() : "";
    const args = body.trim().split(/ +/).slice(1);
    const q = args.join(" ");
    const isGroup = from.endsWith("@g.us");
    const sender = mek.key.fromMe ? robin.user.id : (mek.key.participant || mek.key.remoteJid);
    const senderNumber = sender.split("@")[0];
    const botNumber = robin.user.id.split(":")[0];
    const isMe = botNumber === senderNumber;
    const isOwner = senderNumber === config.OWNER_NUM.replace(/[^0-9]/g, "");
    const pushname = mek.pushName || "User";
    const reply = (teks) => robin.sendMessage(from, { text: teks }, { quoted: mek });

    if (!isOwner && config.MODE === "private") return;
    if (!isOwner && isGroup && config.MODE === "inbox") return;
    if (!isOwner && !isGroup && config.MODE === "groups") return;

    const { commands } = require("./command");
    const cmd = commands.find(c => c.pattern === command || (c.alias && c.alias.includes(command)));

    if (isCmd && cmd) {
      if (cmd.react) robin.sendMessage(from, { react: { text: cmd.react, key: mek.key } });
      try {
        await cmd.function(robin, mek, m, {
          from, quoted: mek, body, isCmd, command, args, q,
          isGroup, sender, senderNumber, botNumber2: await jidNormalizedUser(robin.user.id),
          botNumber, pushname, isMe, isOwner,
          groupMetadata: {}, groupName: "", participants: [], groupAdmins: [], isBotAdmins: false, isAdmins: false,
          reply,
        });
      } catch (e) {
        console.error("Command error:", e);
        reply("Error running command.");
      }
    }
  });
}

app.get("/", (req, res) => res.send("GOJO MAX bot running."));
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
setTimeout(() => connectToWA(), 3000);
