const { cmd } = require('../inconnuboy');
const config = require('../config');
const fg = require('api-dylux');
const yts = require('yt-search');

// 1. Play6 - Audio + Document
cmd({
    pattern: "play6",
    desc: "Download YouTube song MP3",
    react: "🎵",
    category: "download",
    use: ".play6 song name"
},
async(conn, mek, m, { from, q, reply, react, pushname }) => {
    try {
        if (!q) return reply(`🎵 *YouTube Audio* 🎵\n\n❌ Song name ekak danna machan\n💡 *Example:* ${config.PREFIX}play6 Alan Walker Faded`);

        await react("⏳");
        await reply(`> 🔍 *Searching...*`);

        const search = await yts(q);
        const data = search.videos[0];
        if (!data) return reply("❌ Song eka hoya ganna bari una.");

        let desc = `🎵 *MUSIC FOUND* 🎵\n\n📝 *Title:* ${data.title}\n⏱️ *Duration:* ${data.timestamp}\n👀 *Views:* ${data.views}\n📅 *Uploaded:* ${data.ago}\n🔗 *Link:* ${data.url}\n\n${config.BOT_FOOTER}`;

        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        await react("⬇️");
        let down = await fg.yta(data.url);

        // Audio send
        await conn.sendMessage(from, { audio: { url: down.dl_url }, mimetype: "audio/mpeg" }, { quoted: mek });

        // Document send
        await conn.sendMessage(from, {
            document: { url: down.dl_url },
            mimetype: "audio/mpeg",
            fileName: data.title + ".mp3",
            caption: `🎵 *${data.title}*\n${config.BOT_FOOTER}`
        }, { quoted: mek });

        await react("✅");

    } catch (e) {
        console.log(e);
        await react("❌");
        reply(`❌ Hi ${pushname} retry karanna. API down athi.`);
    }
});

// 2. Play5 - Audio with bwmxmd API
cmd({
    pattern: "play5",
    desc: "Download songs via YouTube",
    react: "🎵",
    category: "download",
    use: ".play5 song name"
},
async(conn, mek, m, { from, q, reply, react, pushname }) => {
    try {
        if (!q) return reply("❌ Song name ekak danna machan!");

        await react("⏳");
        const search = await yts(q);
        const song = search.videos[0];
        if (!song) return reply("❌ Song eka na.");

        const caption = `🎵 *DARK-DEV-MINI MUSIC* 🎵\n\n📝 *Title:* ${song.title}\n⏱️ *Duration:* ${song.timestamp}\n👀 *Views:* ${song.views}\n📅 *Uploaded:* ${song.ago}\n🔗 *Link:* ${song.url}\n\n${config.BOT_FOOTER}`;

        await conn.sendMessage(from, { image: { url: song.thumbnail }, caption }, { quoted: mek });

        await react("⬇️");
        const res = await fetch(`https://api.bwmxmd.online/api/download/ytmp3?apikey=ibraah-help&url=${