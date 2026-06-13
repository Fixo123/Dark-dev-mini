const { cmd } = require('../inconnuboy');
const axios = require('axios');
const config = require('../config');

// ── TIKTOK DOWNLOADER ──
cmd({
    pattern: 'tiktok',
    alias: ['tt'],
    desc: 'Download TikTok videos',
    category: 'download',
    react: '📥'
}, async (conn, mek, m, { from, args, reply, sender }) => {
    try {
        const q = args[0];
        if (!q || !q.startsWith("https://")) {
            return reply('*⚠️ Please provide a valid TikTok URL.*');
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // ✅ Fetching data
        const response = await axios.get(`https://api-aswin-sparky.koyeb.app/api/downloader/tiktok?url=${q}`);
        const data = response.data;

        if (!data || !data.status || !data.data) {
            return reply('*❌ Failed to retrieve media.*');
        }
        
        const dat = data.data;
        
        // --- SELECTION PANEL ---
        const caption = `*「 DARK DEV MINI : TT DOWNLOADER 」*

┌───────────────────┐
  📑 *TITLE:* ${dat.title || "No title"}
  ⏱️ *DUR:* ${dat.duration || "N/A"}
  📊 *STATS:* ❤️ ${dat.view || "0"} | 💬 ${dat.comment || "0"}
└───────────────────┘

*Select protocol:*

┏━━━━━━━━━━━━━━━━━━━┓
┃ 1 ‣ *VIDEO (HD)* 🎥
┃ 2 ‣ *AUDIO (MP3)* 🎶
┗━━━━━━━━━━━━━━━━━━━┛
> *Reply with 1 or 2*`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: dat.thumbnail },
            caption,
            contextInfo: {
                mentionedJid: [sender],
                externalAdReply: {
                    title: "DARK DEV MINI : MEDIA CORE",
                    body: "TikTok Content Delivery",
                    thumbnail: { url: dat.thumbnail },
                    sourceUrl: `https://wa.me/${config.OWNER_NUMBER}`,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
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
                    await conn.sendMessage(from, {
                        video: { url: dat.video },
                        caption: "*✅ Video Downloaded*"
                    }, { quoted: receivedMsg });
                    conn.ev.off("messages.upsert", handler);
                } 
                else if (receivedText === "2") {
                    await conn.sendMessage(from, { react: { text: '🎶', key: receivedMsg.key } });
                    await conn.sendMessage(from, {
                        audio: { url: dat.audio },
                        mimetype: "audio/mp4"
                    }, { quoted: receivedMsg });
                    conn.ev.off("messages.upsert", handler);
                }
            }
        };

        conn.ev.on("messages.upsert", handler);
        // Auto-remove listener after 5 minutes
        setTimeout(() => conn.ev.off("messages.upsert", handler), 300000);

    } catch (error) {
        console.error(error);
        reply('*❌ System error occurred.*');
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
