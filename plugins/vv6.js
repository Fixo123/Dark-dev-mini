const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { cmd } = require('../inconnuboy');

// ── VIEW ONCE (VV) ──
cmd({
    pattern: 'vv',
    desc: 'Download view-once media',
    category: 'tools',
    react: '👁️'
}, async (conn, mek, m, { from, quoted, reply }) => {
    try {
        // පණිවිඩය quoted කර ඇත්දැයි බැලීම
        if (!quoted) return reply('*❌ Please reply to a View-Once message.*');

        const msg = quoted.message;
        const viewOnce = msg.viewOnceMessageV2 || msg.viewOnceMessageV2Extension || msg.viewOnceMessage;
        
        if (!viewOnce) return reply('*❌ This is not a View-Once message.*');

        const message = viewOnce.message;
        const vType = Object.keys(message)[0];

        if (['imageMessage', 'videoMessage'].includes(vType)) {
            await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

            const stream = await downloadContentFromMessage(message[vType], vType.replace('Message', ''));
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            if (vType === 'imageMessage') {
                await conn.sendMessage(from, { image: buffer, caption: '*✅ View-Once Image Downloaded*' }, { quoted: mek });
            } else {
                await conn.sendMessage(from, { video: buffer, caption: '*✅ View-Once Video Downloaded*' }, { quoted: mek });
            }
        } else {
            return reply('*❌ Unsupported View-Once media type.*');
        }
    } catch (e) {
        reply('*❌ Error: ' + e.message + '*');
    }
});
