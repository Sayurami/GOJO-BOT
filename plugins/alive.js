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

        // Send voice (ptt: true for voice note style)
        await robin.sendMessage(from, {
            audio: { url: config.ALIVE_VOICE }, // must be a valid mp3/ogg file or file path/url
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
