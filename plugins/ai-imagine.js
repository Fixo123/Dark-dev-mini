const { cmd } = require('../inconnuboy');
const config = require('../config');
const axios = require('axios');

// 1. Flux AI Image
cmd({
    pattern: "aiimage2",
    alias: ["flux", "imagine2"],
    desc: "Generate image using Flux AI",
    category: "ai",
    react: "🎨",
    use: ".flux beautiful sunset"
},
async(conn, mek, m, { from, q, reply, react }) => {
    try {
        if (!q) return reply(`🎨 *Flux AI* 🎨\n\n❌ Prompt ekak danna machan\n💡 *Example:* ${config.PREFIX}flux cute cat wearing glasses`);

        await react("⏳");
        await reply(`> ✨ *CREATING IMAGE...* 🔥\n> Model: Flux AI\n> Prompt: ${q}`);

        const apiUrl = `https://api.siputzx.my.id/api/ai/flux?prompt=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl, { responseType: "arraybuffer", timeout: 60000 });

        if (!data) {
            await react("❌");
            return reply("❌ Image awa na. API down athi.");
        }

        await conn.sendMessage(from, {
            image: Buffer.from(data, "binary"),
            caption: `🎨 *Flux AI Generated*\n\n✨ *Prompt:* ${q}\n\n${config.BOT_FOOTER}`
        }, { quoted: mek });

        await react("✅");

    } catch (e) {
        console.error("Flux Error:", e.message);
        await react("❌");
        reply(`❌ Error: ${e.response?.data?.message || e.message}`);
    }
});

// 2. Stable Diffusion Image
cmd({
    pattern: "aiimage1",
    alias: ["sdiffusion", "imagine1"],
    desc: "Generate image using Stable Diffusion",
    category: "ai",
    react: "🖼️",
    use: ".sdiffusion anime girl"
},
async(conn, mek, m, { from, q, reply, react }) => {
    try {
        if (!q) return reply(`🖼️ *Stable Diffusion* 🖼️\n\n❌ Prompt ekak danna\n💡 *Example:* ${config.PREFIX}sdiffusion cyberpunk city`);

        await react("⏳");
        await reply(`> ✨ *CREATING IMAGE...* 🔥\n> Model: Stable Diffusion\n> Prompt: ${q}`);

        const apiUrl = `https://api.siputzx.my.id/api/ai/stable-diffusion?prompt=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl, { responseType: "arraybuffer", timeout: 60000 });

        if (!data) {
            await react("❌");
            return reply("❌ Image awa na.");
        }

        await conn.sendMessage(from, {
            image: Buffer.from(data, "binary"),
            caption: `🖼️ *Stable Diffusion Generated*\n\n✨ *Prompt:* ${q}\n\n${config.BOT_FOOTER}`
        }, { quoted: mek });

        await react("✅");

    } catch (e) {
        console.error("SD Error:", e.message);
        await react("❌");
        reply(`❌ Error: ${e.response?.data?.message || e.message}`);
    }
});

// 3. Stability AI Image
cmd({
    pattern: "aiimage3",
    alias: ["stability", "imagine3"],
    desc: "Generate image using Stability AI",
    category: "ai",
    react: "🚀",
    use: ".stability dragon flying"
},
async(conn, mek, m, { from, q, reply, react }) => {
    try {
        if (!q) return reply(`🚀 *Stability AI* 🚀\n\n❌ Prompt ekak danna\n💡 *Example:* ${config.PREFIX}stability futuristic car`);

        await react("⏳");
        await reply(`> ✨ *CREATING IMAGE...* 🔥\n> Model: Stability AI\n> Prompt: ${q}`);

        const apiUrl = `https://api.siputzx.my.id/api/ai/stabilityai?prompt=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl, { responseType: "arraybuffer", timeout: 60000 });

        if (!data) {
            await react("❌");
            return reply("❌ Image awa na.");
        }

        await conn.sendMessage(from, {
            image: Buffer.from(data, "binary"),
            caption: `🚀 *Stability AI Generated*\n\n✨ *Prompt:* ${q}\n\n${config.BOT_FOOTER}`
        }, { quoted: mek });

        await react("✅");

    } catch (e) {
        console.error("Stability Error:", e.message);
        await react("❌");
        reply(`❌ Error: ${e.response?.data?.message || e.message}`);
    }
});