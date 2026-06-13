const { cmd } = require('../inconnuboy');

cmd({
    pattern: "vv3",
    alias: ['vv', 'viewonce', 'retrive'],
    desc: "Fetch and resend ViewOnce image/video/audio",
    category: "misc",
    react: "🔥",
    filename: __filename,
    use: ".vv3 [reply to viewonce]"
},
async(conn, mek, m, { from, reply, react, sender }) => {
    try {
        if (!m.quoted) {
            await react("⚠️");
            return reply("👁️ *ViewOnce Saver*\n\n❌ ViewOnce message ekakata reply karala `.vv3` gahapan machan.");
        }

        await react("⏳");

        // v2 format check
        let quotedMsg = m.quoted;
        let msg = quotedMsg.message;

        // viewOnceMessageV2
        if (msg.viewOnceMessageV2) {
            msg = msg.viewOnceMessageV2.message;
        }
        // viewOnceMessage
        else if (msg.viewOnceMessage) {
            msg = msg.viewOnceMessage.message;
        }

        const type = Object.keys(msg)[0];

        if (type === 'imageMessage') {
            let cap = msg.imageMessage.caption || '📸 *DARK DEV MINI VV Saver*';
            let buffer = await conn.downloadMediaMessage(msg.imageMessage);
            await react("✅");
            return await conn.sendMessage(from, {
                image: buffer,
                caption: `${cap}\n\n> *Resent by DARK DEV MINI*`
            }, { quoted: mek });
        }

        if (type === 'videoMessage') {
            let cap = msg.videoMessage.caption || '🎥 *DARK DEV MINI VV Saver*';
            let buffer = await conn.downloadMediaMessage(msg.videoMessage);
            await react("✅");
            return await conn.sendMessage(from, {
                video: buffer,
                caption: `${cap}\n\n> *Resent by DARK DEV MINI*`
            }, { quoted: mek });
        }

        if (type === 'audioMessage') {
            let buffer = await conn.downloadMediaMessage(msg.audioMessage);
            await react("✅");
            return await conn.sendMessage(from, {
                audio: buffer,
                mimetype: 'audio/mp4'
            }, { quoted: mek });
        }

        await react("❌");
        return reply("❌ Me ViewOnce image/video/audio ekak newei machan.");

    } catch (e) {
        console.error("VV Error:", e);
        await react("❌");
        reply("❌ ViewOnce message eka save karanna bari una. Message eka delete wela athi.");
    }
});