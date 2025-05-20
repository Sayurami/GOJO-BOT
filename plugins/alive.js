const { cmd, commands } = require('../command');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["bot", "robot"],
    react: "👻",
    desc: "Bot එක ඔන්ලයින්ද බලන්න.",
    category: "main",
    filename: __filename
},
async (robin, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup,
    sender, senderNumber, botNumber2, botNumber, pushname,
    isMe, isOwner, groupMetadata, groupName, participants,
    groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        const ALIVE_IMG = process.env.ALIVE_IMG || "https://example.com/default.jpg";
        const ALIVE_MSG = process.env.ALIVE_MSG || "Hey! Bot එක ඔන්ලයින් එකයි!";

        await robin.sendMessage(from, {
            image: { url: ALIVE_IMG },
            caption: ALIVE_MSG
        }, { quoted: mek });

        await robin.sendMessage(from, {
            audio: {
                url: "https://github.com/Gojo899/Bot-photo-and-video-/raw/refs/heads/main/mp3/1747630063493150813rf60n6vl-voicemaker.in-speech.mp3"
            },
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
