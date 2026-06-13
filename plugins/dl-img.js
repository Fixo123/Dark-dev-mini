const { cmd } = require('../inconnuboy');
const axios = require("axios");

cmd({
    pattern: "img",
    alias: ["image", "googleimage", "searchimg"],
    react: "🦋",
    desc: "Search and download Google images",
    category: "fun",
    use: ".img <keywords>",
    filename: __filename
}, async(conn, mek, m, { from, q, reply, react }) => {
    try {
        if (!q) return reply("🖼️ *Google Image Search* 🖼️\n\n❌ Keywords danna machan\n💡 *Example:* .img cute cats");

        await react("🔍");
        await reply(`🔍 Searching images for "${q}"...`);

        const url = `https://apis.davidcyriltech.my.id/googleimage?query=${encodeURIComponent(q)}`;
        const response = await axios.get(url);

        if (!response.data?.success || !response.data.results?.length) {
            await react("❌");
            return reply("❌ Images hoya ganna bari una. Wena keywords try karanna");
        }

        const results = response.data.results;
        const selectedImages = results.sort(() => 0.5 - Math.random()).slice(0, 5);

        await react("✅");
        
        for (const imageUrl of selectedImages) {
            await conn.sendMessage(
                from,
                { 
                    image: { url: imageUrl },
                    caption: `📷 *Result for:* ${q}\n> *© DARK DEV MINI*`
                },
                { quoted: mek }
            );
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

    } catch (error) {
        console.error('Image Search Error:', error);
        await react("❌");
        reply(`❌ Error: ${error.message || "Images fetch karanna bari una"}`);
    }
});