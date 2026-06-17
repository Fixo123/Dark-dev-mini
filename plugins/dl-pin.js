const { cmd } = require('../inconnuboy');
const axios = require('axios');

// ── PINTEREST DOWNLOADER ──
cmd({
    pattern: 'pinterest',
    alias: ['pin', 'pins', 'pindownload'],
    desc: 'Download media from Pinterest',
    category: 'download',
    react: '📌'
}, async (conn, mek, m, { args, from, reply }) => {
    try {
        if (!args[0]) return reply('*❌ Please provide a Pinterest URL.*');

        const pinterestUrl = args[0];
        
        // API ඇමතුම
        const response = await axios.get(`https://bk9.fun/download/pinterest?url=${encodeURIComponent(pinterestUrl)}`);

        if (!response.data.status) {
            return reply('*❌ Failed to fetch data from Pinterest.*');
        }

        const media = response.data.BK9;
        
        const desc = `*DARK DEV MINI*

*PINS DOWNLOADER*
╭━━❐━⪼
┇๏ *Owner* - ${response.data.owner}
╰━━❑━⪼
> *© Pᴏᴡᴇʀᴇᴅ Bʏ 𝐅ɪxᴏ 𝐃ᴇᴠ ♡*`;

        if (media && media.length > 0) {
            const videoUrl = media.find(item => item.url.includes('.mp4'))?.url;
            const imageUrl = media.find(item => item.url.includes('.jpg'))?.url;

            if (videoUrl) {
                await conn.sendMessage(from, { video: { url: videoUrl }, caption: desc }, { quoted: mek });
            } else if (imageUrl) {
                await conn.sendMessage(from, { image: { url: imageUrl }, caption: desc }, { quoted: mek });
            } else {
                reply('*❌ No media found.*');
            }
        } else {
            reply('*❌ No media found.*');
        }
    } catch (e) {
        reply('*❌ Error: ' + e.message + '*');
    }
});
