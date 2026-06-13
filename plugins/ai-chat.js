const { cmd } = require('../inconnuboy');
const axios = require('axios');

// ── AI CHAT COMMAND ──
cmd({
    pattern: 'ai',
    desc: 'Chat with ChatGPT',
    category: 'ai',
    react: '🤖'
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const query = args.join(' ');
        if (!query) return reply('*❌ Please provide a question or message! Example: .ai Hello*');

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        // API call eka
        const apiUrl = `https://chatgpt-api.faizankhichi.me/?q=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);

        // API eken ena result eka hoyala ewanna
        // (API eke structure eka anuwa meka wenas wenna puluwan)
        const result = response.data.result || response.data.answer || response.data;

        await reply(`*🤖 ChatGPT:* \n\n${result}`);

    } catch (e) {
        reply('*❌ Error connecting to AI service: ' + e.message + '*');
    }
});
