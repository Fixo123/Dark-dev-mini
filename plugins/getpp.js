const { cmd } = require('../inconnuboy');

// ── GET PROFILE PICTURE (DP) ──
cmd({
    pattern: "dp",
    desc: "Get profile picture of a user",
    category: "general",
    react: "🖼️"
},
async(conn, mek, m, { from, quoted, isGroup, sender, reply }) => {
    try {
        let target;

        // 1. Get target from mention
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            target = m.mentionedJid[0];
        } 
        // 2. Get target from reply
        else if (quoted) {
            target = quoted.sender;
        } 
        // 3. Default target (User themselves)
        else {
            target = sender;
        }

        // Reaction for feedback
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        let ppUrl;
        try {
            // Try fetching high-res image
            ppUrl = await conn.profilePictureUrl(target, 'image');
        } catch (e) {
            try {
                // Try fetching preview if high-res fails
                ppUrl = await conn.profilePictureUrl(target, 'preview');
            } catch (e2) {
                // Fallback to a default profile icon if both fail
                ppUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
            }
        }

        await conn.sendMessage(from, { 
            image: { url: ppUrl }, 
            caption: `✅ *Profile Picture*\n👤 *User:* @${target.split('@')[0]}`,
            mentions: [target]
        }, { quoted: mek });

    } catch (e) {
        console.error("DP Command Error:", e);
        reply(`❌ Error: Could not process DP command.`);
    }
});
