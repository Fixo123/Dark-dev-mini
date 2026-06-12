const { cmd } = require('../inconnuboy');
const config = require('../config');
const axios = require('axios');
const FormData = require('form-data');

// Commande Remove Background
cmd({
    pattern: "removebg",
    desc: "Remove image background",
    category: "tools",
    react: "🖼️",
    use: ".removebg + pinhthurayata reply"
},
async(conn, mek, m, { from, quoted, reply }) => {
    try {
        // 1. API Key check karanawa
        if (!config.CLIPDROP_API_KEY) {
            return reply('❌ `CLIPDROP_API_KEY` set කරලා නෑ .env එකේ.\nclipdrop.co එකෙන් free key එකක් ගන්න.');
        }

        // 2. Image ekata reply karada balanawa
        const quotedMsg = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quotedMsg?.imageMessage) {
            return reply('❌ Pinhthurayakata reply karala `.removebg` danna machan.');
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        // 3. Image download karanawa
        const media = await conn.downloadMediaMessage(quotedMsg);
        
        // 4. ClipDrop API eke BG remove karanawa
        const form = new FormData();
        form.append('image_file', media, { filename: 'image.png' });

        const response = await axios.post('https://clipdrop-api.com/remove-background/v1', form, {
            headers: {
               ...form.getHeaders(),
                'x-api-key': config.CLIPDROP_API_KEY
            },
            responseType: 'arraybuffer',
            timeout: 30000
        });

        const resultBuffer = Buffer.from(response.data);

        // 5. Result eka yawanaawa
        await conn.sendMessage(from, { 
            image: resultBuffer,
            caption: `✅ *BG Removed Successfully*\n\n${config.BOT_FOOTER}`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (e) {
        console.log('RemoveBG Error:', e.message);
        
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });

        if (e.response?.status === 403) {
            reply('❌ ClipDrop API key eka invalid. Nattan limit iwarai.');
        } else if (e.code === 'ECONNABORTED') {
            reply('❌ Image eka lokui. Piti image ekak try karanna.');
        } else {
            reply(`❌ Error: ${e.message}`);
        }
    }
});
