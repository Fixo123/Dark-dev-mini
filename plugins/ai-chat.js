const { cmd } = require('../inconnuboy');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// ඔබේ API Key එක මෙතැනට ඇතුළත් කරන්න
const genAI = new GoogleGenerativeAI("AQ.Ab8RN6Kft_xcvnlFfG-esAm7GSaqVzF59rbNg51SnwuRieSOcg");

// ── AI CHAT COMMAND (GEMINI) ──
cmd({
    pattern: 'ai',
    desc: 'Chat with Gemini AI',
    category: 'ai',
    react: '🤖'
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const query = args.join(' ');
        if (!query) return reply('*❌ Please provide a question! Example: .ai How are you?*');

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        // Gemini Model එක තෝරා ගැනීම (gemini-1.5-flash ඉතා වේගවත් වේ)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(query);
        const response = await result.response;
        const text = response.text();

        await reply(`*🤖 Gemini AI:*\n\n${text}`);

    } catch (e) {
        reply('*❌ Error connecting to Gemini AI: ' + e.message + '*');
    }
});
