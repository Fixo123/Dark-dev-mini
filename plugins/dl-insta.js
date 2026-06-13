const { cmd } = require('../inconnuboy');
const axios = require('axios');

cmd({
    pattern: "insta",
    alias: ["ig", "igdl"],
    desc: "Download Instagram reels/posts/stories",
    category: "downloader",
    react: "🎵",
    filename: __filename,
    use: ".insta link"
},
async(conn, mek, m, { from, q, reply, react, sender }) => {
    try {
        if (!q) return reply("📸 *Instagram Downloader* 📸\n\n❌ Valid IG link ekak danna machan\n💡 *Example:* .insta https://www.instagram.com/reel/ABC123/");

        if (!q.includes("instagram.com")) return reply("❌ Me Instagram link ekak newei machan.");

        await react("⏳");
        await reply("⏳ *Processing your request...*");

        const apiUrl = `https://delirius-apiofc.vercel.app/download/igstories?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !Array.isArray(data.data)) {
            await react("❌");
            return reply("❌ Media fetch karanna bari una. Link eka check karala balanna.");
        }

        // Video nam video, nathnam image ganna
        const media = data.data.find(m => m.type === "video") || data.data.find(m => m.type === "image");

        if (!media || !media.url) {
            await react("❌");
            return reply("❌ Valid media ekak na response eke.");
        }

        const caption = `📸 *DARK DEV MINI IG DOWNLOADER*\n\n🎬 *Type:* ${media.type}\n📁 *Extension:* ${media.ext || 'unknown'}\n\n> *© DARK DEV MINI*`;

        await react("⬇️");

        if (media.type === "video") {
            await conn.sendMessage(from, { video: { url: media.url }, caption }, { quoted: mek });
        } else if (media.type === "image") {
            await conn.sendMessage(from, { image: { url: media.url }, caption }, { quoted: mek });
        } else {
            reply("⚠️ Unsupported media type.");
        }

        await react("✅");

    } catch (e) {
        console.error("Insta Downloader Error:", e);
        await react("❌");
        reply(`❌ Error: ${e.message || "Something went wrong"}`);
    }
});