const { cmd } = require('../inconnuboy');
const axios = require('axios');

cmd({
    pattern: "tiktok",
    alias: ["ttdl", "tt", "tiktokdl"],
    desc: "Download TikTok video without watermark",
    category: "downloader",
    react: "🎵",
    filename: __filename,
    use: ".tt link"
},
async(conn, mek, m, { from, q, reply, react, sender }) => {
    try {
        if (!q) return reply("🎵 *TikTok Downloader* 🎵\n\n❌ TikTok link ekak danna machan\n💡 *Example:* .tt https://vt.tiktok.com/ABC123/");
        
        if (!q.includes("tiktok.com")) return reply("❌ Me TikTok link ekak newei machan.");
        
        await react("⏳");
        await reply("⏳ Video download karanawa, tikak wait karanna...");
        
        const apiUrl = `https://delirius-apiofc.vercel.app/download/tiktok?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        
        if (!data.status || !data.data) {
            await react("❌");
            return reply("❌ Video fetch karanna bari una. Link eka check karanna.");
        }
        
        const { title, like, comment, share, author, meta } = data.data;
        const videoUrl = meta?.media?.find(v => v.type === "video")?.org;
        
        if (!videoUrl) {
            await react("❌");
            return reply("❌ Video URL hoya ganna bari una.");
        }
        
        const caption = `🎵 *DARK DEV MINI TIKTOK DL*\n\n` +
                        `👤 *User:* ${author.nickname} (@${author.username})\n` +
                        `📖 *Title:* ${title || 'No caption'}\n` +
                        `👍 *Likes:* ${like?.toLocaleString() || 0} | 💬 *Comments:* ${comment?.toLocaleString() || 0} | 🔁 *Shares:* ${share?.toLocaleString() || 0}\n\n` +
                        `> *© DARK DEV MINI*`;
        
        await react("⬇️");
        
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: caption
        }, { quoted: mek });
        
        await react("✅");
        
    } catch (e) {
        console.error("TikTok Downloader Error:", e);
        await react("❌");
        reply(`❌ Error: ${e.message || "Video download karanna bari una"}`);
    }
});