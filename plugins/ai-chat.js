const { cmd } = require('../inconnuboy');
const axios = require('axios');

const API_BASE = "https://ai-proxy-server-smoky.vercel.app";

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

        // API ඉල්ලීම සිදු කිරීම
        const res = await axios.post(`${API_BASE}/gemini`, { query: q });

        // ප්‍රතිචාරය පරීක්ෂා කිරීම
        if (res.data && res.data.answer) {
            await conn.sendMessage(from, { text: res.data.answer }, { quoted: mek });
        } else {
            reply('*❌ Gemini did not return a valid response.*');
        }
        
    } catch (e) {
        // Error එක පෙන්වීම
        console.error("Gemini Error:", e.message);
        
        let errorMessage = '*❌ Failed to fetch response from Gemini.*';
        if (e.response) {
            errorMessage += `\n*Status:* ${e.response.status}`;
        }
        
        reply(errorMessage);
    }
});
