const { cmd } = require('../inconnuboy');
const config = require('../config');

const linkPatterns = [
  /https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi,
  /^https?:\/\/(www\.)?whatsapp\.com\/channel\/([a-zA-Z0-9_-]+)$/,
  /wa\.me\/\S+/gi,
  /https?:\/\/(?:t\.me|telegram\.me)\/\S+/gi,
  /https?:\/\/(?:www\.)?youtube\.com\/\S+/gi,
  /https?:\/\/youtu\.be\/\S+/gi,
  /https?:\/\/(?:www\.)?facebook\.com\/\S+/gi,
  /https?:\/\/fb\.me\/\S+/gi,
  /https?:\/\/(?:www\.)?instagram\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?twitter\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?tiktok\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?linkedin\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?snapchat\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?pinterest\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?reddit\.com\/\S+/gi,
  /https?:\/\/ngl\/\S+/gi,
  /https?:\/\/(?:www\.)?discord\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?twitch\.tv\/\S+/gi,
  /https?:\/\/(?:www\.)?vimeo\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?dailymotion\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?medium\.com\/\S+/gi
];

cmd({
    on: "body",
    react: "🔗"
}, async(conn, mek, m, { from, body, sender, isGroup, isAdmins, isBotAdmins, react }) => {
    try {
        // Group ekak nathnam, admin nam, bot admin nathnam wada na
        if (!isGroup || isAdmins ||!isBotAdmins) return;

        // Anti-link OFF nam wada na
        if (config.ANTI_LINK!== 'true') return;

        // Message eke link ekak thiyenawada check
        const containsLink = linkPatterns.some(pattern => pattern.test(body));

        if (containsLink) {
            await react("🚫");
            await conn.sendMessage(from, { delete: m.key });

            // Warning yawanna one nam meka uncomment karanna
            // await conn.sendMessage(from, {
            // text: `🚫 *DARK DEV MINI ANTI-LINK*\n\n@${sender.split('@')[0]} links danna epa group eke!`,
            // mentions: [sender]
            // });
        }
    } catch (e) {
        console.error("Anti-Link Error:", e);
    }
});