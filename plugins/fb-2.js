const { cmd } = require('../inconnuboy');
const axios = require('axios');

cmd({
    pattern: "fb2",
    alias: ["facebook2", "fbhd"],
    desc: "Download Facebook videos HD only",
    category: "downloader",
    react: "📺",
    filename: __filename,
    use: ".fb2 link"
},
async(conn, mek, m, { from, q, reply, react, sender }) => {
    try {
        if (!q) return reply("📺 *Facebook Downloader* 📺\n\n❌ FB video link ekak danna machan\n💡 *Example:*.fb2 https://www.facebook.com/watch?v=xxx");

        if (!q.includes("facebook.com")) return reply("❌ Me Facebook link ekak newei machan.");

        await react("⏳");
        await reply("⏳ HD video download karanawa...");

        // API 3ta with fallback
        const apis = [
            `https://apis.davidcyriltech.my.id/facebook2?url=${encodeURIComponent(q)}`,
            `https://api.siputzx.my.id/api/d/fbdl?url=${encodeURIComponent(q)}`,
            `https://api.betabotz.eu.org/api/downloader/fb?url=${encodeURIComponent(q)}&apikey=BETA`
        ];

        let data;
        let success = false;

        for (const apiUrl of apis) {
            try {
                const res = await axios.get(apiUrl, { timeout: 30000 });
                data = res.data;
                if (data.status && data.video?.downloads?.length > 0) {
                    success = true;
                    break;
                }
            } catch (e) {
                console.log(`API failed: ${apiUrl}`);
                continue;
            }
        }

        if (!success) {
            await react("❌");
            return reply("❌ Video fetch karanna bari una. Link eka public da balanna.");
        }

        const { title, thumbnail, downloads } = data.video;
        const hdVideo = downloads.find(d => d.quality === "HD" || d.quality === "hd") || downloads[0];

        if (!hdVideo?.downloadUrl &&!hdVideo?.url) {
            await react("❌");
            return reply("❌ HD video naha. SD quality try karanna.");
        }

        const videoUrl = hdVideo.downloadUrl || hdVideo.url;
        const quality = hdVideo.quality || "HD";

        const caption = `📺 *DARK DEV MINI FB DOWNLOADER*\n\n` +
                        `📖 *Title:* ${title || 'No title'}\n` +
                        `🎬 *Quality:* ${quality}\n\n` +
                        `> *© DARK DEV MINI*`;

        await react("⬇️");

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: caption
        }, { quoted: mek });

        await react("✅");

    } catch (e) {
        console.error("Facebook downloader error:", e);
        await react("❌");
        reply(`❌ Error: ${e.message || "Video download karanna bari una"}`);
    }
});