const axios = require("axios");
const { cmd } = require('../inconnuboy'); // ඔබේ file path එක අනුව වෙනස් කරන්න
const config = require('../config');

cmd({
    pattern: 'instagram',
    alias: ['insta'],
    desc: 'Download Instagram videos and audio',
    category: 'download',
    react: '📥'
}, async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        if (!q || !q.startsWith("https://")) {
            return reply("⚠️ *Please provide a valid Instagram URL.*");
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        const apiUrl = `https://api-aswin-sparky.koyeb.app/api/downloader/igdl?url=${encodeURIComponent(q)}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data || !data.status || !data.data || data.data.length === 0) {
            return reply("❌ *Failed to fetch media.*");
        }

        const media = data.data[0];

        const caption = `*「 DARK DEV MINI : IG DOWNLOADER 」*

✨ *Type:* ${media.type.toUpperCase()}
🔗 *Status:* Link Ready

*Select your format:*
01 ‣ *HD Video File* 🎥
02 ‣ *Audio MP3* 🎶

> *Reply with 1 or 2*`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: media.thumbnail },
            caption: caption
        }, { quoted: mek });

        const messageID = sentMsg.key.id;

        // --- INTERACTIVE LISTENER ---
        const handler = async (msgData) => {
            const receivedMsg = msgData.messages[0];
            if (!receivedMsg?.message) return;

            const receivedText = (receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text || "").trim();
            const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

            if (isReplyToBot) {
                if (receivedText === "1") {
                    await conn.sendMessage(from, { react: { text: '🎥', key: receivedMsg.key } });
                    await conn.sendMessage(from, { video: { url: media.url }, caption: "*ᴀᴋɪɴᴅᴜ-ᴍᴅ*" }, { quoted: receivedMsg });
                    conn.ev.off("messages.upsert", handler);
                } else if (receivedText === "2") {
                    await conn.sendMessage(from, { react: { text: '🎶', key: receivedMsg.key } });
                    await conn.sendMessage(from, { audio: { url: media.url }, mimetype: "audio/mp4" }, { quoted: receivedMsg });
                    conn.ev.off("messages.upsert", handler);
                }
            }
        };

        conn.ev.on("messages.upsert", handler);
        setTimeout(() => conn.ev.off("messages.upsert", handler), 300000); // 5 minutes timeout

    } catch (e) {
        reply('*❌ Error: ' + e.message + '*');
    }
});
