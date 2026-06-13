const { cmd } = require('../inconnuboy');
const config = require('../config');
const axios = require('axios');

cmd({
    pattern: "cpt",
    alias: ["capcut", "capcut-dl"],
    desc: "Download Capcut templates",
    category: "download",
    react: "🎥",
    use: ".cpt capcut link"
},
async(conn, mek, m, { from, q, reply, react }) => {
    try {
        // Link check
        if (!q || !q.startsWith("http")) {
            return reply(`🎥 *CapCut Downloader* 🎥\n\n❌ Valid CapCut link ekak danna machan\n💡 *Example:* ${config.PREFIX}cpt https://www.capcut.com/t/Zsxxxx`);
        }

        await react("⏳");
        await reply(`> 📥 *Downloading CapCut Template...* 🔥`);

        // API call
        const apiUrl = `https://api.diioffc.web.id/api/download/capcut?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl, { timeout: 30000 });

        // Data check
        if (!data || data.status !== true || !data.result || !data.result.url) {
            await react("❌");
            return reply("⚠️ Template eka download karanna bari una. Link eka hari da balanna.");
        }

        // Video send
        await conn.sendMessage(from, {
            video: { url: data.result.url },
            mimetype: "video/mp4",
            caption: `🎥 *CapCut Template*\n\n📝 *Title:* ${data.result.title || 'No Title'}\n📏 *Size:* ${data.result.size || 'Unknown'}\n\n${config.BOT_FOOTER}`
        }, { quoted: mek });

        await react("✅");

    } catch (e) {
        console.error("CapCut Error:", e.message);
        await react("❌");
        
        if (e.code === 'ECONNABORTED') {
            reply("⏰ Timeout una. Link eka thawa welawek try karanna.");
        } else {
            reply("❌ Error ekak awa. Link eka public da balanna.");
        }
    }
});