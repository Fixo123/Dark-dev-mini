const { cmd } = require('../inconnuboy');
const { ytmp3, ytmp4, tiktok } = require("sadaslk-dlcore");
const yts = require("yt-search");

async function getYoutube(query) {
    const isUrl = /(youtube\.com|youtu\.be)/i.test(query);
    if (isUrl) {
        const id = query.split("v=")[1] || query.split("/").pop();
        const info = await yts({ videoId: id });
        return info;
    }
    const search = await yts(query);
    if (!search.videos.length) return null;
    return search.videos[0];
}

// ── YTMP3 ──
cmd({
    pattern: 'ytmp3',
    alias: ['yta', 'song'],
    desc: 'Download YouTube MP3 by name or link',
    category: 'download',
    react: '🎵'
}, async (bot, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("*❌ Please provide a song name or link.*");
        reply("*🔎 Searching...*");
        const video = await getYoutube(q);
        if (!video) return reply("*❌ No results found.*");

        const caption = `🎵 *${video.title}*\n\n👤 Channel: ${video.author.name}\n⏱ Duration: ${video.timestamp}\n👀 Views: ${video.views.toLocaleString()}\n🔗 ${video.url}`;
        await bot.sendMessage(from, { image: { url: video.thumbnail }, caption }, { quoted: mek });
        
        reply("*⬇️ Downloading MP3...*");
        const data = await ytmp3(video.url);
        if (!data?.url) return reply("*❌ Failed to download MP3.*");

        await bot.sendMessage(from, { audio: { url: data.url }, mimetype: "audio/mpeg" }, { quoted: mek });
    } catch (e) {
        reply('*❌ Error: ' + e.message + '*');
    }
});

// ── YTMP4 ──
cmd({
    pattern: 'ytmp4',
    alias: ['ytv', 'video'],
    desc: 'Download YouTube MP4 by name or link',
    category: 'download',
    react: '🎬'
}, async (bot, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("*❌ Please provide a video name or link.*");
        reply("*🔎 Searching...*");
        const video = await getYoutube(q);
        if (!video) return reply("*❌ No results found.*");

        const caption = `🎬 *${video.title}*\n\n👤 Channel: ${video.author.name}\n⏱ Duration: ${video.timestamp}\n👀 Views: ${video.views.toLocaleString()}\n🔗 ${video.url}`;
        await bot.sendMessage(from, { image: { url: video.thumbnail }, caption }, { quoted: mek });

        reply("*⬇️ Downloading video...*");
        const data = await ytmp4(video.url, { format: "mp4", videoQuality: "720" });
        if (!data?.url) return reply("*❌ Failed to download video.*");

        await bot.sendMessage(from, { video: { url: data.url }, mimetype: "video/mp4", fileName: data.filename || "video.mp4", caption: "🎬 YouTube video" }, { quoted: mek });
    } catch (e) {
        reply('*❌ Error: ' + e.message + '*');
    }
});

// ── TIKTOK ──
cmd({
    pattern: 'tiktok',
    alias: ['tt'],
    desc: 'Download TikTok video',
    category: 'download',
    react: '📱'
}, async (bot, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("*❌ Please provide a TikTok link.*");
        reply("*⬇️ Downloading TikTok video...*");

        const data = await tiktok(q);
        if (!data?.no_watermark) return reply("*❌ Failed to download TikTok video.*");

        const caption = `🎵 *${data.title || "TikTok Video"}*\n\n👤 Author: ${data.author || "Unknown"}\n⏱ Duration: ${data.runtime}s`;
        await bot.sendMessage(from, { video: { url: data.no_watermark }, caption }, { quoted: mek });
    } catch (e) {
        reply('*❌ Error: ' + e.message + '*');
    }
});
