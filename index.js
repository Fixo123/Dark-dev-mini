const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pairRouter = require('./inconnu');
app.use('/', pairRouter);

// ========== BAILEYS BOT CODE MEKE IDAN ==========
const voiceDB = {
  "Bs":"https://files.catbox.moe/b3vk8p.mp3",
  "Gm":"https://files.catbox.moe/61b6xc.mp3",
  "Gn":"https://files.catbox.moe/0y528f.mp3",
  "Hi":"https://github.com/Lokunima2001/NIMA-GIT-TES/raw/refs/heads/main/detabase/Hi.mp3",
  "Oya kewada":"https://github.com/Lokunima2001/NIMA-GIT-TES/raw/refs/heads/main/detabase/Oya%20kewada.mp3",
  "mk":"https://files.catbox.moe/kr05q7.mp3",
  "මොකද කරන්නෙ":"https://files.catbox.moe/kr05q7.mp3",
  "හුත්තෝ":"https://files.catbox.moe/t1y0pr.mp3",
  "Hmm":"https://files.catbox.moe/4ot3zd.mp3",
  "හ්ම්":"https://files.catbox.moe/4ot3zd.mp3",
  "Mm":"https://files.catbox.moe/4ot3zd.mp3",
  "ම්":"https://files.catbox.moe/4ot3zd.mp3",
  "කැරියො":"https://files.catbox.moe/69v6i3.mp3",
  "ponnayo":"https://files.catbox.moe/69v6i3.mp3",
  "huththo":"https://files.catbox.moe/69v6i3.mp3",
  "pako":"https://files.catbox.moe/69v6i3.mp3",
  "පකයො":"https://files.catbox.moe/69v6i3.mp3",
  "good morning":"https://files.catbox.moe/61b6xc.mp3",
  "good night":"https://files.catbox.moe/0y528f.mp3",
  ".menu":"https://files.catbox.moe/ipnctb.mp3",
  "mn":"https://files.catbox.moe/kr05q7.mp3"
};

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true, // QR console eke pennai
        logger: pino({ level: 'silent' })
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode!== 401;
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('✅ Bot connected!');
        }
    });

    // Voice auto reply handler
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];
        if (!m.message || m.key.fromMe) return;

        const text = m.message.conversation || m.message.extendedTextMessage?.text || '';
        const cleanText = text.trim();

        // Case ignore karala match karana widiya
        const key = Object.keys(voiceDB).find(k => k.toLowerCase() === cleanText.toLowerCase());

        if (key && voiceDB[key]) {
            try {
                await sock.sendMessage(m.key.remoteJid, {
                    audio: { url: voiceDB[key] },
                    mimetype: 'audio/mpeg',
                    ptt: true
                }, { quoted: m });
                console.log(`[VOICE] Sent: ${key}`);
            } catch (e) {
                console.log('Voice send error:', e.message);
            }
        }
    });
}

startBot();
// ========== BAILEYS BOT CODE MEKEN IWARA ==========

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});

module.exports = app;
