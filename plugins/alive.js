const { readEnv } = require('../lib/database');
const { cmd, commands } = require('../command');

cmd({
    pattern: "alive",
    alias: "bot",
    react: "👻",
    desc: "Check bot online or no.",
    category: "main",
    filename: __filename
}, async (robin, mek, m, {
    from, quoted, body, isCmd, command, args, q,
    isGroup, sender, senderNumber, botNumber2, botNumber,
    pushname, isMe, isOwner, groupMetadata, groupName,
    participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        const config = await readEnv();

        // Send image + caption
        await robin.sendMessage(from, {
            image: { url: config.ALIVE_IMG },
            caption: config.ALIVE_MSG
        }, { quoted: mek });

        // Send voice message (PTT style)
        await robin.sendMessage(from, {
            audio: { url: "https://github.com/Gojo899/Bot-photo-and-video-/raw/refs/heads/main/mp3/1747630063493150813rf60n6vl-voicemaker.in-speech.mp3" },
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
