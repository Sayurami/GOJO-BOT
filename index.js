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
const P = require("pino");
const qrcode = require("qrcode-terminal");
const path = require("path");
const util = require("util");
const axios = require("axios");

const {
  getBuffer,
  getGroupAdmins,
} = require("./lib/functions");

const { sms } = require("./lib/msg");
const config = require("./config");
const ownerNumber = config.OWNER_NUM;

// Session from Mega.nz
const { File } = require("megajs");

if (!fs.existsSync(__dirname + "/auth_info_baileys/creds.json")) {
  if (!config.SESSION_ID) return console.log("Please add your session to SESSION_ID env !!");
  const sessdata = config.SESSION_ID;
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
  filer.download((err, data) => {
    if (err) throw err;
    fs.writeFile(__dirname + "/auth_info_baileys/creds.json", data, () => {
      console.log("Session downloaded ✅");
    });
  });
}

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

async function connectToWA() {
  const { readEnv } = require("./lib/database");
  const envConfig = await readEnv();
  const prefix = envConfig.PREFIX;

  console.log("Connecting GOJO MAX...");

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
    if (connection === "close") {
      if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
        connectToWA();
      }
    } else if (connection === "open") {
      console.log("Installing plugins...");
      fs.readdirSync("./plugins/").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() === ".js") {
          require("./plugins/" + plugin);
        }
      });
      console.log("GOJO MAX installed & connected to WhatsApp ✅");

      robin.sendMessage(ownerNumber + "@s.whatsapp.net", {
        image: {
          url: `https://raw.githubusercontent.com/gojo7668/Bot-photo-/refs/heads/main/file_00000000085461f8bf4e8572ec9ed5f2%20(1).png`,
        },
        caption: "GOJO MAX connected successfully ✅",
      });
    }
  });

  robin.ev.on("creds.update", saveCreds);

  robin.ev.on("messages.upsert", async (mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;

    mek.message = getContentType(mek.message) === "ephemeralMessage"
      ? mek.message.ephemeralMessage.message
      : mek.message;

    if (mek.key.remoteJid === "status@broadcast") return;

    const m = sms(robin, mek);
    const type = getContentType(mek.message);
    const from = mek.key.remoteJid;
    const body =
      type === "conversation"
        ? mek.message.conversation
        : type === "extendedTextMessage"
        ? mek.message.extendedTextMessage.text
        : type === "imageMessage" && mek.message.imageMessage.caption
        ? mek.message.imageMessage.caption
        : type === "videoMessage" && mek.message.videoMessage.caption
        ? mek.message.videoMessage.caption
        : "";

    const isCmd = body.startsWith(prefix);
    const command = isCmd ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase() : "";
    const args = body.trim().split(/ +/).slice(1);
    const q = args.join(" ");
    const isGroup = from.endsWith("@g.us");
    const sender = mek.key.fromMe
      ? robin.user.id.split(":")[0] + "@s.whatsapp.net"
      : mek.key.participant || mek.key.remoteJid;
    const senderNumber = sender.split("@")[0];
    const botNumber = robin.user.id.split(":")[0];
    const pushname = mek.pushName || "User";
    const isMe = botNumber.includes(senderNumber);
    const isOwner = ownerNumber.includes(senderNumber) || isMe;
    const botNumber2 = await jidNormalizedUser(robin.user.id);

    const groupMetadata = isGroup ? await robin.groupMetadata(from).catch(() => {}) : "";
    const groupName = isGroup ? groupMetadata.subject : "";
    const participants = isGroup ? await groupMetadata.participants : [];
    const groupAdmins = isGroup ? await getGroupAdmins(participants) : [];
    const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
    const isAdmins = isGroup ? groupAdmins.includes(sender) : false;

    const reply = (text) => {
      robin.sendMessage(from, { text }, { quoted: mek });
    };

    robin.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
      let mime = (await axios.head(url)).headers["content-type"];
      if (mime.split("/")[1] === "gif") {
        return robin.sendMessage(
          jid,
          { video: await getBuffer(url), caption, gifPlayback: true, ...options },
          { quoted, ...options }
        );
      }

      const type = mime.split("/")[0];
      if (mime === "application/pdf") {
        return robin.sendMessage(
          jid,
          { document: await getBuffer(url), mimetype: mime, caption, ...options },
          { quoted, ...options }
        );
      }

      if (type === "image") {
        return robin.sendMessage(jid, { image: await getBuffer(url), caption, ...options }, { quoted, ...options });
      }
      if (type === "video") {
        return robin.sendMessage(jid, { video: await getBuffer(url), caption, mimetype: "video/mp4", ...options }, { quoted, ...options });
      }
      if (type === "audio") {
        return robin.sendMessage(jid, { audio: await getBuffer(url), caption, mimetype: "audio/mpeg", ...options }, { quoted, ...options });
      }
    };

    // Bot Mode Filter
    if (!isOwner && config.MODE === "private") return;
    if (!isOwner && isGroup && config.MODE === "inbox") return;
    if (!isOwner && !isGroup && config.MODE === "groups") return;

    // Command Execution
    const events = require("./command");
    const cmdName = isCmd ? command : false;

    if (cmdName) {
      const cmd =
        events.commands.find((cmd) => cmd.pattern === cmdName) ||
        events.commands.find((cmd) => cmd.alias?.includes(cmdName));
      if (cmd) {
        if (cmd.react) {
          robin.sendMessage(from, { react: { text: cmd.react, key: mek.key } });
        }

        try {
          cmd.function(robin, mek, m, {
            from,
            quoted: m.quoted,
            body,
            isCmd,
            command,
            args,
            q,
            isGroup,
            sender,
            senderNumber,
            botNumber2,
            botNumber,
            pushname,
            isMe,
            isOwner,
            groupMetadata,
            groupName,
            participants,
            groupAdmins,
            isBotAdmins,
            isAdmins,
            reply,
          });
        } catch (e) {
          console.error("[PLUGIN ERROR]", e);
        }
      }
    }

    // Non-command triggers
    events.commands.map((cmd) => {
      if (cmd.on === "body" && body) {
        cmd.function(robin, mek, m, {
          from,
          body,
          isCmd,
          command,
          args,
          q,
          isGroup,
          sender,
          senderNumber,
          botNumber2,
          botNumber,
          pushname,
          isMe,
          isOwner,
          groupMetadata,
          groupName,
          participants,
          groupAdmins,
          isBotAdmins,
          isAdmins,
          reply,
        });
      }
    });
  });
}

app.get("/", (req, res) => {
  res.send("GOJO MAX started ✅");
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));

setTimeout(() => {
  connectToWA();
}, 4000);
