const { cmd } = require('../inconnuboy');
const axios = require("axios");
const cheerio = require("cheerio");

cmd({
    pattern: 'pinterest',
    react: '📌',
    desc: 'Download images or videos from Pinterest',
    category: 'download',
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('*❌ Please provide a Pinterest link.*');

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        // Pinterest වෙතින් දත්ත ලබා ගැනීම
        const { data } = await axios.get(`https://pinterestdownloader.com/api/v2/pinterest-downloader?url=${encodeURIComponent(q)}`);
        
        if (!data || !data.data) {
            return reply('*❌ Failed to fetch media from this link.*');
        }

        const media = data.data;
        const mediaUrl = media.medias[0].url; // වීඩියෝ හෝ පින්තූරයේ URL එක
        const type = media.type; // 'image' හෝ 'video'
        const title = media.title || "Pinterest Content";

        const caption = `╭━━❰ 📌 *PIN DOWNLOAD* ❱━━╮\n┃ 📝 Title: *${title}*\n┃ 🎥 Type: *${type.toUpperCase()}*\n╰━━━━━━━━━━━━━━━╯`;

        if (type === 'video') {
            await conn.sendMessage(from, { video: { url: mediaUrl }, caption: caption }, { quoted: mek });
        } else {
            await conn.sendMessage(from, { image: { url: mediaUrl }, caption: caption }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
    } catch (e) {
        console.error("Pinterest Download Error:", e);
        reply('*❌ An error occurred. Please try again later.*');
    }
});
