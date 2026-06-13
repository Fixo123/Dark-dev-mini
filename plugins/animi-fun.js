const { cmd } = require('../inconnuboy');
const config = require('../config');
const axios = require('axios');

// 1. Loli/Garl
cmd({
    pattern: "garl",
    alias: ["imgloli", "loli"],
    react: '😎',
    desc: "Random anime loli image",
    category: "anime",
    use: '.garl'
},
async(conn, mek, m, { from, reply, react }) => {
    try {
        await react("⏳");
        let res = await axios.get('https://api.lolicon.app/setu/v2?num=1&r18=0&tag=lolicon', { timeout: 10000 });
        let wm = `😎 *Random Loli*\n\n${config.BOT_FOOTER}`;
        await conn.sendMessage(from, { image: { url: res.data[0].urls.original }, caption: wm }, { quoted: mek });
        await react("✅");
    } catch (e) {
        await react("❌");
        reply("❌ Image awa na machan.");
        console.log(e);
    }
});

// 2. Waifu
cmd({
    pattern: "waifu",
    alias: ["imgwaifu"],
    react: '💫',
    desc: "Random waifu image",
    category: "anime",
    use: '.waifu'
},
async(conn, mek, m, { from, reply, react }) => {
    try {
        await react("⏳");
        let res = await axios.get('https://api.waifu.pics/sfw/waifu');
        let wm = `🩵 *Random Waifu*\n\n${config.BOT_FOOTER}`;
        await conn.sendMessage(from, { image: { url: res.data.url }, caption: wm }, { quoted: mek });
        await react("✅");
    } catch (e) {
        await react("❌");
        reply("❌ Waifu awa na.");
    }
});

// 3. Neko
cmd({
    pattern: "neko",
    alias: ["imgneko"],
    react: '🐱',
    desc: "Random neko image",
    category: "anime",
    use: '.neko'
},
async(conn, mek, m, { from, reply, react }) => {
    try {
        await react("⏳");
        let res = await axios.get('https://api.waifu.pics/sfw/neko');
        let wm = `🩷 *Random Neko*\n\n${config.BOT_FOOTER}`;
        await conn.sendMessage(from, { image: { url: res.data.url }, caption: wm }, { quoted: mek });
        await react("✅");
    } catch (e) {
        await react("❌");
        reply("❌ Neko awa na.");
    }
});

// 4. Megumin
cmd({
    pattern: "megumin",
    alias: ["imgmegumin"],
    react: '💥',
    desc: "Random megumin image",
    category: "anime",
    use: '.megumin'
},
async(conn, mek, m, { from, reply, react }) => {
    try {
        await react("⏳");
        let res = await axios.get('https://api.waifu.pics/sfw/megumin');
        let wm = `❤️‍🔥 *Megumin*\n\n${config.BOT_FOOTER}`;
        await conn.sendMessage(from, { image: { url: res.data.url }, caption: wm }, { quoted: mek });
        await react("✅");
    } catch (e) {
        await react("❌");
        reply("❌ Megumin awa na.");
    }
});

// 5. Maid
cmd({
    pattern: "maid",
    alias: ["imgmaid"],
    react: '🧹',
    desc: "Random maid image",
    category: "anime",
    use: '.maid'
},
async(conn, mek, m, { from, reply, react }) => {
    try {
        await react("⏳");
        let res = await axios.get('https://api.waifu.im/search/?included_tags=maid');
        let wm = `😎 *Random Maid*\n\n${config.BOT_FOOTER}`;
        await conn.sendMessage(from, { image: { url: res.data.images[0].url }, caption: wm }, { quoted: mek });
        await react("✅");
    } catch (e) {
        await react("❌");
        reply("❌ Maid awa na.");
    }
});

// 6. Awoo
cmd({
    pattern: "awoo",
    alias: ["imgawoo"],
    react: '🐺',
    desc: "Random awoo image",
    category: "anime",
    use: '.awoo'
},
async(conn, mek, m, { from, reply, react }) => {
    try {
        await react("⏳");
        let res = await axios.get('https://api.waifu.pics/sfw/awoo');
        let wm = `😎 *Awoo~*\n\n${config.BOT_FOOTER}`;
        await conn.sendMessage(from, { image: { url: res.data.url }, caption: wm }, { quoted: mek });
        await react("✅");
    } catch (e) {
        await react("❌");
        reply("❌ Awoo awa na.");
    }
});

// 7. Anime Girl - 1 command ekak hari
cmd({
    pattern: "animegirl",
    alias: ["imganimegirl"],
    react: '🧚',
    desc: "Random anime girl",
    category: "anime",
    use: '.animegirl'
},
async(conn, mek, m, { from, reply, react }) => {
    try {
        await react("⏳");
        let res = await axios.get('https://api.waifu.pics/sfw/waifu');
        let wm = `🧚 *Anime Girl*\n\n${config.BOT_FOOTER}`;
        await conn.sendMessage(from, { image: { url: res.data.url }, caption: wm }, { quoted: mek });
        await react("✅");
    } catch (e) {
        await react("❌");
        reply("❌ Image awa na.");
    }
});

// 8. Anime Pack - 5 images
cmd({
    pattern: "anime",
    react: '⛱️',
    desc: "Send 5 random anime images",
    category: "anime",
    use: '.anime'
},
async(conn, mek, m, { from, reply, react }) => {
    try {
        await react("⏳");
        await reply("> *Sending anime pack...*");
        
        const urls = [
            'https://telegra.ph/file/b26f27aa5daaada031b90.jpg',
            'https://telegra.ph/file/51b44e4b086667361061b.jpg',
            'https://telegra.ph/file/7d165d73f914985542537.jpg',
            'https://telegra.ph/file/3d9732d2657d2d72dc102.jpg',
            'https://telegra.ph/file/8daf7e432a646f3ebe7eb.jpg'
        ];
        
        for(let url of urls) {
            await conn.sendMessage(from, { image: { url }, caption: `> *DARK DEV MINI*\n${config.BOT_FOOTER}` }, { quoted: mek });
            await new Promise(r => setTimeout(r, 1000)); // 1sec delay spam wenna epa
        }
        await react("✅");
    } catch(e) {
        await react("❌");
        reply("❌ Error.");
    }
});

// 9. Dog
cmd({
    pattern: "dog",
    react: "🐶",
    desc: "Random dog image",
    category: "fun",
    use: '.dog'
},
async(conn, mek, m, { from, reply, react }) => {
    try {
        await react("⏳");
        let res = await axios.get('https://dog.ceo/api/breeds/image/random');
        await conn.sendMessage(from, { image: { url: res.data.message }, caption: `🐶 *Random Dog*\n\n${config.BOT_FOOTER}` }, { quoted: mek });
        await react("✅");
    } catch (e) {
        await react("❌");
        reply("❌ Dog awa na.");
    }
});