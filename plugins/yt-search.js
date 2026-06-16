const { cmd } = require('../inconnuboy');
const yts = require("yt-search");

// ── YOUTUBE SEARCH ──
cmd({
    pattern: 'yts',
    alias: ['youtubesearch'],
    desc: 'Search YouTube videos',
    category: 'search',
    react: '🔎'
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('*❌ Please provide a search query!*');

        await reply('*🔎 Searching YouTube for you...*');

        const search = await yts(q);
        if (!search || !search.videos || search.videos.length === 0) {
            return reply('*❌ No results found on YouTube.*');
        }

        const results = search.videos.slice(0, 10);
        let formattedResults = results.map((v, i) => (
            `🎬 *${i + 1}. ${v.title}*\n📅 ${v.ago} | ⌛ ${v.timestamp} | 👁️ ${v.views.toLocaleString()} views\n🔗 ${v.url}`
        )).join("\n\n");

        const caption = `*_Your YouTube search results_*
─────────────────────────
🔎 *Query*: ${q}

${formattedResults}`;

        await conn.sendMessage(from, {
            image: {
                url: "https://github.com/DANUWA-MD/DANUWA-MD/blob/main/images/yts.png?raw=true"
            },
            caption: caption
        }, { quoted: mek });

    } catch (e) {
        reply('*❌ Error: ' + e.message + '*');
    }
});
