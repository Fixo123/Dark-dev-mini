const { cmd } = require('../inconnuboy');
const axios = require("axios");

// ── FACEBOOK DOWNLOADER ──
cmd({
    pattern: "facebook",
    alias: ["fb"],
    desc: "Download Facebook videos",
    category: "download",
    use: ".fb <link>",
    react: "🎥"
}, async (conn, mek, m, { from, args, reply, sender }) => {
    try {
        const q = args.join(" ");
        if (!q || !q.startsWith("https://")) {
            return reply("⚠️ *Please provide a valid Facebook URL.*");
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        const apiUrl = `https://api-aswin-sparky.koyeb.app/api/downloader/fbdl?url=${encodeURIComponent(q)}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data?.status || !data?.data) {
            return reply("❌ *Failed to fetch media. Please try again.*");
        }

        const { title, thumbnail, low, high } = data.data;

        // --- SELECTION PANEL ---
        const caption = `
*「 FACEBOOK DOWNLOADER 」*

┌───────────────────┐
  📑 *Title:* ${title || "No title"}
└───────────────────┘

*Select quality:*
1. 📉 *SD Quality*
2. 📈 *HD Quality*
3. 🎶 *Audio MP3*

*Reply with 1, 2, or 3 to download.*`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: thumbnail },
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
                if (["1", "2", "3"].includes(receivedText)) {
                    await conn.sendMessage(from, { react: { text: '⏳', key: receivedMsg.key } });

                    if (receivedText === "1") {
                        await conn.sendMessage(from, { video: { url: low }, caption: "*✅ SD Video*" }, { quoted: receivedMsg });
                    } else if (receivedText === "2") {
                        await conn.sendMessage(from, { video: { url: high }, caption: "*✅ HD Video*" }, { quoted: receivedMsg });
                    } else if (receivedText === "3") {
                        await conn.sendMessage(from, { audio: { url: low || high }, mimetype: "audio/mp4" }, { quoted: receivedMsg });
                    }

                    await conn.sendMessage(from, { react: { text: '✅', key: receivedMsg.key } });
                    conn.ev.off("messages.upsert", handler);
                }
            }
        };

        conn.ev.on("messages.upsert", handler);
        // විනාඩි 5කින් listener එක ඉවත් කරයි
        setTimeout(() => conn.ev.off("messages.upsert", handler), 300000);

    } catch (error) {
        reply('*❌ Error: ' + error.message + '*');
    }
});
