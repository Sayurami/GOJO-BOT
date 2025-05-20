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
            image: { url: "https://raw.githubusercontent.com/Gojo899/Bot-photo-and-video-/refs/heads/main/Photo/file_00000000d0dc61f597f450261ecfe33f%20(1).png" },
            caption: 
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
