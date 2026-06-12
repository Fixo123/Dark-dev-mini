const { cmd } = require('../inconnuboy');
const config = require('../config');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

cmd({
    pattern: "removebg",
    desc: "Remove background from an image",
    category: "tools",
    react: "🖼️"
},
async(conn, mek, m, { from, quoted, reply, body, args }) => {
    try {
        let mediaMsg = null;
        let type = Object.keys(m.message || {})[0];

        // Case 1: Image ekak + caption.removebg
        if (type === 'imageMessage' && (m.message.imageMessage.caption || '').toLowerCase().includes('.removebg')) {
            mediaMsg = m;
        }
        // Case 2: Image ekata reply karala.removebg
        else if (quoted && quoted.message?.imageMessage) {
            mediaMsg = quoted;
        }
        else {
            return await reply("❌ පින්තූරයක් එක්ක `.removebg` type කරන්න, නැත්තම් පින්තූරෙට reply කරලා `.removebg` කියන්න.");
        }

        const media = await conn.downloadAndSaveMediaMessage(mediaMsg);
        if (!media) return await reply("❌ Pinhthura download wenne na.");

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const formData = new FormData();
        formData.append('image_file', fs.createReadStream(media));

        const response = await axios.post('https://clipdrop-api.co/remove-background/v1', formData, {
            headers: {
              ...formData.getHeaders(),
                'x-api-key': config.CLIPDROP_API_KEY
            },
            responseType: 'arraybuffer',
            timeout: 60000
        });

        await conn.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: "*✅ Background Removed Successfully!*"
        }, { quoted: mek });

        fs.unlinkSync(media);
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.log("RemoveBG Error:", e.response?.data || e.message);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });

        if (e.response?.status === 401) {
            reply("❌ Clipdrop API Key eka invalid/waradi. config.js balanna.");
        } else if (e.response?.status === 429) {
            reply("❌ API limit idiriyai. 1hr walin passe try karanna.");
        } else {
            reply("❌ Error: " + (e.response?.data?.error || e.message));
        }
    }
});
