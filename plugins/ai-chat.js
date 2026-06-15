const { cmd } = require('../inconnuboy');
const axios = require('axios');

const API_BASE = "https://ai-proxy-server-smoky.vercel.app/";

// ── GEMINI AI ──
cmd({
    pattern: 'gemini',
    desc: 'Chat with Gemini AI',
    category: 'ai',
    react: '✨'
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('*❌ Please provide a query or prompt.*');

        await conn.sendPresenceUpdate('composing', from);

        const payload = { query: q };
        const res = await axios.post(`${API_BASE}/gemini`, payload);

        const answer = res.data.answer || '*❌ No response received from Gemini.*';
        
        await conn.sendMessage(from, { text: answer }, { quoted: mek });
    } catch (e) {
        console.error("Gemini Error:", e.message);
        reply('*❌ Failed to fetch response from Gemini.*');
    }
});
