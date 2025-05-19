const { cmd, commands } = require("../command");
const config = require('../config');
cmd(
  {
    pattern: "menu",
    alise: ["getmenu"],
    react: "📜",
    desc: "get cmd list",
    category: "main",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    {
      from,
      quoted,
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
    }
  ) => {
    try {
      let menu = {
        main: "",
        download: "",
        group: "",
        owner: "",
        convert: "",
        search: "",
      };

      for (let i = 0; i < commands.length; i++) {
        if (commands[i].pattern && !commands[i].dontAddCommandList) {
          menu[
            commands[i].category
          ] += `${config.PREFIX}${commands[i].pattern}\n`;
        }
      }

      let madeMenu = `👋 *Hello  ${pushname}*


| *MAIN COMMANDS* |
    ▫️.alive
    ▫️.menu
    ▫️
    ▫️
    ▫️
| *DOWNLOAD COMMANDS* |
    ▫️
    ▫️
    ▫️
| *GROUP COMMANDS* |
${menu.group}
| *OWNER COMMANDS* |
    ▫️.restart
    ▫️.update
| *CONVERT COMMANDS* |
    ▫️
    ▫️
    ▫️
    ▫️
| *SEARCH COMMANDS* |
${menu.search}


🥶𝐌𝐚𝐝𝐞 𝐛𝐲 𝕊𝔸𝕐𝕌ℝ𝔸🥶

> 𝔾𝕆𝕁𝕆 MENU MSG
`;
      await robin.sendMessage(
        from,
        {
          image: {
            url: "https://raw.githubusercontent.com/Gojo899/Bot-photo-and-video-/refs/heads/main/Photo/file_00000000d0dc61f597f450261ecfe33f%20(1).png",
          },
          caption: madeMenu,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.log(e);
      reply(`${e}`);
    }
  }
);
