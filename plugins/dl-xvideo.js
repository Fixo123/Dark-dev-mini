const { cmd } = require('../inconnuboy'); // ඔබගේ නිවැරදි path එක මෙතනට දාන්න
const { fetchJson } = require('../lib/functions');

// ── XNXX DOWNLOADER ──
cmd({
    pattern: 'xnxx',
    alias: ['xv', 'xvideo'],
    desc: 'All-in-one X-Search & Download',
    category: 'download',
    react: '🔞'
}, async (conn, mek, m, { q, from, sender, reply }) => {
    try {
        if (!q) return reply("*⚠️ Please provide a search term.*");

        // 1. Unified Search
        const searchRes = await fetchJson(`https://api-aswin-sparky.koyeb.app/api/search/xnxx?search=${encodeURIComponent(q)}`);
        const results = searchRes?.result?.result;

        if (!results || results.length === 0) return reply("*❌ No results found.*");

        // 2. Build Results List
        let list = `*「 ᴅᴀʀᴋ ᴅᴇᴠ ᴍɪɴɪ : x-sᴇᴀʀᴄʜ ᴄᴏʀᴇ 」*\n\n`;
        results.slice(0, 10).forEach((vid, i) => {
            list += `*${i + 1}* ‣ ${vid.title}\n`;
        });
        list += `\n*Reply with number to select*`;

        const listMsg = await conn.sendMessage(from, { 
            text: list, 
            contextInfo: { mentionedJid: [sender] } 
        }, { quoted: mek });

        // 3. Selection & Download Listener
        const handler = async (update) => {
            const msg = update?.messages?.[0];
            if (!msg?.message || msg.message.extendedTextMessage?.contextInfo?.stanzaId !== listMsg.key.id) return;

            const index = parseInt(msg.message.conversation || msg.message.extendedTextMessage?.text) - 1;
            if (isNaN(index) || index < 0 || index >= results.length) return;

            await conn.sendMessage(from, { react: { text: '⏳', key: msg.key } });
            
            // Fetch Download Data
            const dlRes = await fetchJson(`https://api-aswin-sparky.koyeb.app/api/downloader/xnxx?url=${encodeURIComponent(results[index].link)}`);
            const info = dlRes?.data;
            if (!info) return reply("*❌ Download failed.*");

            // Delivery
            const finalCaption = `*「 ᴅᴀʀᴋ ᴅᴇᴠ ᴍɪɴɪ : x-ᴅᴇʟɪᴠᴇʀʏ 」*\n\n*Title:* ${info.title}\n*Duration:* ${info.duration || "N/A"}`;

            await conn.sendMessage(from, { 
                video: { url: info.files.high || info.files.low }, 
                caption: finalCaption
            }, { quoted: msg });

            // Cleanup listener
            conn.ev.off("messages.upsert", handler);
        };

        conn.ev.on("messages.upsert", handler);
        setTimeout(() => conn.ev.off("messages.upsert", handler), 300000); // 5 min timeout

    } catch (e) {
        reply('*❌ Error: ' + e.message + '*');
    }
});
