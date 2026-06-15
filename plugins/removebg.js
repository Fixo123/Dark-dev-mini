const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const FormData = require('form-data');
const axios = require('axios');
const { cmd } = require('../inconnuboy');

// ── REMOVE BACKGROUND ──
cmd({
    pattern: 'removebg',
    alias: ['rbg'],
    desc: 'Remove background from image',
    category: 'tools',
    react: '🖼️'
}, async (conn, mek, m, { from, quoted, reply }) => {
    try {
        // පින්තූරයක් හෝ reply කර ඇති පින්තූරයක් තිබේදැයි පරීක්ෂා කිරීම
        const isQuotedImage = quoted && (quoted.imageMessage || quoted.viewOnceMessageV2?.message?.imageMessage);
        if (!isQuotedImage) return reply('*❌ Please reply to an image.*');

        await reply('*⏳ Removing background, please wait...*');

        // පින්තූරය download කරගැනීම
        const media = await downloadContentFromMessage(quoted.imageMessage || quoted.viewOnceMessageV2.message.imageMessage, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of media) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        // Remove.bg API වෙත යැවීම
        const formData = new FormData();
        formData.append('size', 'auto');
        formData.append('image_file', buffer, 'file.jpg');

        const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
            headers: {
                ...formData.getHeaders(),
                'X-Api-Key': 'JABqCMojeFq6wcis5Z3714V3' // ඔබ ලබා දුන් API Key එක
            },
            responseType: 'arraybuffer'
        });

        // Background ඉවත් කළ පින්තූරය යැවීම
        await conn.sendMessage(from, { 
            image: Buffer.from(response.data), 
            caption: '*✅ Background removed successfully!*' 
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply('*❌ Error: ' + (e.response?.data?.errors?.[0]?.title || e.message) + '*');
    }
});
