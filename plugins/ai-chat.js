const { cmd } = require('../inconnuboy');
const config = require('../config');
const axios = require('axios');

// AI Chat Command
cmd({
    pattern: "ai",
    alias: ["bot", "chatgpt", "gpt"],
    desc: "Chat with AI model",
    category: "ai",
    react: "🤖",
    use: ".ai your message"
},
async(conn, mek, m, { from, q, reply, react }) => {
    try {
        // Message eka nathnam
        if (!q) {
            return reply(`🤖 *AI Chat* 🤖\n\n❌ Message ekak danna machan\n💡 *Example:* ${config.PREFIX}ai ඔයා කවුද?`);
        }

        // Processing react
        await react("⏳");

        // API call
        const apiUrl = `https://apis-keith.vercel.app/ai/gpt?q=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl, { timeout: 30000 });

        // Data check
        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("❌ AI response ekak awa na. Thawa welawek try karanna.");
        }

        // Cute response format
        const aiText = `🤖 *DARK DEV AI* 🤖\n\n💬 *You:* ${q}\n\n✨ *AI:* ${data.result}\n\n> ${config.BOT_FOOTER}`;

        await reply(aiText);
        await react("✅");

    } catch (e) {
        console.error("AI Error:", e.message);
        await react("❌");
        
        if (e.code === 'ECONNABORTED') {
            reply("⏰ AI timeout una. Message eka koti karala balanna.");
        } else {
            reply("❌ AI ekata connect wenne na. API down athi.");
        }
    }
});