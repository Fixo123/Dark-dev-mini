const fs = require('fs');
const path = require('path');
const config = require('../config');
const { cmd, commands } = require('../command');
const { getUserConfigFromMongoDB } = require('../lib/database');

// Combined Auto Features Handler (Voice, Sticker, Reply, Recording)
cmd({
    on: "body"
}, async (conn, mek, m, { from, body, sender }) => {
    try {
        // Fetch database settings for the sender
        const number = sender.split('@')[0];
        const userConfig = await getUserConfigFromMongoDB(number) || {};

        // Helper function to check if a feature is enabled (Database or Config)
        const isEnabled = (dbVal, configVal) => dbVal === 'true' || dbVal === true || configVal === 'true' || configVal === true;

        const textInput = body.toLowerCase().trim();

        // 🎙️ 1. AUTO VOICE
        if (isEnabled(userConfig.AUTO_RECORDING, config.AUTO_VOICE)) {
            const voicePath = path.join(__dirname, '../data/autovoice.json');
            if (fs.existsSync(voicePath)) {
                const voiceData = JSON.parse(fs.readFileSync(voicePath, 'utf8'));
                if (voiceData[textInput]) {
                    await conn.sendPresenceUpdate('recording', from);
                    return await conn.sendMessage(from, { 
                        audio: { url: voiceData[textInput] }, 
                        mimetype: 'audio/mpeg', 
                        mp3: true 
                    }, { quoted: mek });
                }
            }
        }

        // 🧸 2. AUTO STICKER
        if (isEnabled(userConfig.AUTO_STICKER, config.AUTO_STICKER)) {
            const stickerPath = path.join(__dirname, '../data/autosticker.json');
            if (fs.existsSync(stickerPath)) {
                const stickerData = JSON.parse(fs.readFileSync(stickerPath, 'utf8'));
                if (stickerData[textInput]) {
                    return await conn.sendMessage(from, { 
                        sticker: { url: stickerData[textInput] }, 
                        package: '🌸 TOHID_MD ~ Cute Edition 🌸' 
                    }, { quoted: mek });
                }
            }
        }

        // 🎀 3. AUTO REPLY
        if (isEnabled(userConfig.AUTO_REPLY, config.AUTO_REPLY)) {
            const replyPath = path.join(__dirname, '../data/autoreply.json');
            if (fs.existsSync(replyPath)) {
                const replyData = JSON.parse(fs.readFileSync(replyPath, 'utf8'));
                if (replyData[textInput]) {
                    return await m.reply(replyData[textInput]);
                }
            }
        }

        // ⚡ 4. FAKE RECORDING (If no specific voice trigger matched)
        if (isEnabled(userConfig.AUTO_RECORDING, config.FAKE_RECORDING)) {
            await conn.sendPresenceUpdate('recording', from);
        }

    } catch (e) {
        console.error("💔 Auto features error:", e);
    }
});
