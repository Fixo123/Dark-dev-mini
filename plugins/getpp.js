const { cmd } = require('../inconnuboy');

// ── GET PROFILE PICTURE (DP) ──
cmd({
    pattern: 'dp',
    desc: 'Get user profile picture',
    category: 'tools',
    react: '👤'
}, async (conn, mek, m, { from, quoted, mentionedJid, reply }) => {
    try {
        // ඉලක්කගත පරිශීලකයා හඳුනා ගැනීම (mention, reply, හෝ තමාගේ)
        const target = (mentionedJid && mentionedJid[0]) || 
                       (quoted && quoted.sender) || 
                       m.sender;

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        let ppUrl;
        try {
            // High-res profile picture ලබා ගැනීම
            ppUrl = await conn.profilePictureUrl(target, 'image');
        } catch (e) {
            // නොමැති නම් preview ලබා ගැනීම
            try {
                ppUrl = await conn.profilePictureUrl(target, 'preview');
            } catch (e2) {
                // කිසිවක් සොයාගත නොහැකි නම් default image එකක් භාවිතා කිරීම
                ppUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
            }
        }

        await conn.sendMessage(from, { 
            image: { url: ppUrl }, 
            caption: `✅ *Profile Picture*\n👤 *User:* @${target.split('@')[0]}`,
            mentions: [target]
        }, { quoted: mek });

    } catch (e) {
        reply('*❌ Error: Could not process DP command.*');
    }
});
