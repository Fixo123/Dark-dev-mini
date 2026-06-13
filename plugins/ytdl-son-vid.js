const { cmd } = require('../inconnuboy'); // ඔබේ කෝඩ් එකේ ඇති පරිදි නිවැරදි Path එක දෙන්න
const yts = require('yt-search');
const axios = require('axios');

// --- SONG COMMAND ---
cmd({
    pattern: 'song',
    desc: 'Download YouTube MP3',
    category: 'download',
    react: '🎵'
}, async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        if (!q) return reply("⚠️ *Please provide a song name.*");

        const search = await yts(q);
        if (!search.videos.length) return reply("❌ *No results found.*");

        const data = search.videos[0];
        const api = `https://ominisave.vercel.app/api/ytmp3_v3?url=${encodeURIComponent(data.url)}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes.result?.downloadUrl) return reply("❌ *Download failed.*");

        const caption = `*「 ᴅᴀʀᴋ ᴅᴇᴠ ᴍɪɴɪ: ᴍᴜsɪᴄ ᴄᴏʀᴇ 」*\n\n🎵 *Title:* ${data.title}\n⏱️ *Dur:* ${data.timestamp}\n\n*Select Format:*\n01 ‣ Audio\n02 ‣ Document\n03 ‣ Voice Note`;

        const sentMsg = await conn.sendMessage(from, { image: { url: data.thumbnail }, caption }, { quoted: mek });

        const handler = async (msgData) => {
            const receivedMsg = msgData.messages[0];
            if (!receivedMsg?.message) return;
            const text = (receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text || "").trim();
            if (receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId !== sentMsg.key.id) return;

            if (["1", "01", "2", "02", "3", "03"].includes(text)) {
                await conn.sendMessage(from, { react: { text: '📥', key: receivedMsg.key } });
                const url = apiRes.result.downloadUrl;
                if (text === "1" || text === "01") {
                    await conn.sendMessage(from, { audio: { url }, mimetype: "audio/mpeg" }, { quoted: receivedMsg });
                } else if (text === "2" || text === "02") {
                    await conn.sendMessage(from, { document: { url }, mimetype: "audio/mpeg", fileName: `${data.title}.mp3` }, { quoted: receivedMsg });
                } else {
                    await conn.sendMessage(from, { audio: { url }, mimetype: "audio/mpeg", ptt: true }, { quoted: receivedMsg });
                }
                conn.ev.off("messages.upsert", handler);
            }
        };

        conn.ev.on("messages.upsert", handler);
        setTimeout(() => conn.ev.off("messages.upsert", handler), 300000);
    } catch (e) { reply('*❌ Error: ' + e.message + '*'); }
});

// --- VIDEO COMMAND ---
cmd({
    pattern: 'video',
    desc: 'Download YouTube MP4',
    category: 'download',
    react: '🎬'
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("⚠️ *Please provide a video name.*");

        const search = await yts(q);
        if (!search.videos.length) return reply("❌ *No results found.*");

        const data = search.videos[0];
        const caption = `*「 ᴅᴀʀᴋ ᴅᴇᴠ ᴍɪɴɪ : ᴠɪᴅᴇᴏ ᴄᴏʀᴇ 」*\n\n🎬 *Title:* ${data.title}\n\n*Select Protocol:*\n01 ‣ 360p\n02 ‣ 720p\n03 ‣ 360p (Doc)\n04 ‣ 720p (Doc)`;

        const sentMsg = await conn.sendMessage(from, { image: { url: data.thumbnail }, caption }, { quoted: mek });

        const handler = async (msgData) => {
            const receivedMsg = msgData.messages[0];
            if (!receivedMsg?.message) return;
            const text = (receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text || "").trim();
            if (receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId !== sentMsg.key.id) return;

            let quality = (text === "2" || text === "02" || text === "4" || text === "04") ? "720p" : "360p";
            let isDoc = (text === "3" || text === "03" || text === "4" || text === "04");

            await conn.sendMessage(from, { react: { text: '⏳', key: receivedMsg.key } });
            const api = `https://ominisave.vercel.app/api/ytmp4_v2?url=${encodeURIComponent(data.url)}&quality=${quality}`;
            const { data: apiRes } = await axios.get(api);

            if (apiRes?.status && apiRes.result?.downloadUrl) {
                const media = isDoc ? { document: { url: apiRes.result.downloadUrl }, fileName: `${data.title}.mp4`, mimetype: "video/mp4" } : { video: { url: apiRes.result.downloadUrl } };
                await conn.sendMessage(from, media, { quoted: receivedMsg });
                conn.ev.off("messages.upsert", handler);
            }
        };

        conn.ev.on("messages.upsert", handler);
        setTimeout(() => conn.ev.off("messages.upsert", handler), 300000);
    } catch (e) { reply('*❌ Error: ' + e.message + '*'); }
});
