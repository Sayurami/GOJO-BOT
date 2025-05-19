const askChatGPT = require("../lib/chatgpt");

module.exports = {
  pattern: "ai",
  desc: "ChatGPT සමඟ කතා කරන්න",
  alias: ["chatgpt", "gpt"],
  react: "🤖",
  async function(robin, mek, m, { q, reply }) {
    if (!q) return reply("කරුණාකර ඔබේ ප්‍රශ්නය ටයිප් කරන්න. උදා: .ai GOJO කියන්නේ මොකද්ද?");
    const response = await askChatGPT(q);
    reply(response);
  },
};
