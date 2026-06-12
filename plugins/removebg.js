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
async(conn, mek, m, { from, quoted, reply }) => {
    try {
        // පින්තූරයක් යොමු කර තිබේදැයි පරීක්ෂා කිරීම (වඩාත් නිවැරදි ක්‍රමය)
        const isQuotedImage = quoted && (
            quoted.mtype === 'imageMessage' || 
            (quoted.mtype === 'viewOnceMessage' && quoted.message.imageMessage) ||
            (quoted.mtype === 'extendedTextMessage' && quoted.contextInfo?.quotedMessage?.imageMessage)
        );
        
        if (!isQuotedImage) {
            return await reply("❌ කරුණාකර පින්තූරයක් Reply කර .removebg ලෙස ලබා දෙන්න.");
        }

        const media = await conn.downloadAndSaveMediaMessage(quoted);
        
        const formData = new FormData();
        formData.append('image_file', fs.createReadStream(media));

        const response = await axios.post('https://clipdrop-api.co/remove-background/v1', formData, {
            headers: {
                ...formData.getHeaders(),
                'x-api-key': config.CLIPDROP_API_KEY
            },
            responseType: 'arraybuffer'
        });

        await conn.sendMessage(from, { 
            image: Buffer.from(response.data), 
            caption: "*✅ Background Removed Successfully!*" 
        }, { quoted: mek });

        fs.unlinkSync(media);

    } catch (e) {
        console.log(e);
        reply("❌ Error: " + (e.response?.data?.error || e.message));
    }
});
