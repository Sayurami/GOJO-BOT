const os = require('os');
const moment = require('moment');
require('moment-duration-format');

module.exports = {
  pattern: "ping",
  desc: "Check bot's response time.",
  category: "main",
  react: "🚀",
  filename: __filename,

  async function(conn, mek, m, { from, reply }) {
    try {
      const startTime = Date.now();
      const message = await conn.sendMessage(from, { text: '> *PINGING...*' });
      const endTime = Date.now();
      const ping = endTime - startTime;

      const memoryUsage = process.memoryUsage().rss / 1024 / 1024;
      const cpuLoad = os.loadavg()[0];
      const uptime = moment.duration(process.uptime(), 'seconds').format("h [hrs], m [min], s [sec]");
      const nodeVersion = process.version;

      const responseText = `
> *🚀 GOJO MD - පරිශීලක තොරතුරු*
> *⚡ Speed:* ${ping}ms
> *🧠 Memory:* ${memoryUsage.toFixed(2)} MB
> *🖥️ CPU Load:* ${cpuLoad.toFixed(2)}%
> *⏱️ Uptime:* ${uptime}
> *🛠️ Node.js:* ${nodeVersion}
      `;

      await conn.sendMessage(from, { text: responseText.trim() }, { quoted: message });
    } catch (e) {
      console.error(e);
      reply(`Error: ${e}`);
    }
  }
};
