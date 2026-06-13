const { cmd } = require('../inconnuboy');

// ── REACT (FAKE SUPPORT) ──
cmd({
    pattern: 'react',
    alias: ['fake', 'fakereact'],
    desc: 'Send reactions',
    category: 'general',
    react: '✨'
}, async (conn, mek, m, { from, args, reply, quoted }) => {
    try {
        // emoji එකක් ලබා දී ඇත්දැයි බැලීම (පළමු පරාමිතිය ලෙස)
        const emoji = args[0] || '✨';
        
        // පණිවිඩයක් Reply කර ඇත්නම් එහි key එක භාවිතා කරන්න, නැතහොත් ලැබුණු පණිවිඩයේ key එක භාවිතා කරන්න
        const key = quoted ? quoted.key : mek.key;

        // Reaction යැවීම
        await conn.sendMessage(from, {
            react: { 
                text: emoji, 
                key: key 
            }
        });
    } catch (e) {
        reply('*❌ Error: ' + e.message + '*');
    }
});
