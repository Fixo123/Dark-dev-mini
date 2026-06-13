const { cmd } = require('../inconnuboy');

cmd({
    pattern: "jid",
    alias: ["id", "chatid", "gjid"],  
    desc: "Get full JID of current chat/user",
    react: "🆔",
    category: "utility",
    filename: __filename,
}, async(conn, mek, m, { from, isGroup, isCreator, reply, react, sender }) => {
    try {
        if (!isCreator) {
            await react("❌");
            return reply("❌ *Owner witharak me command eka use karanna puluwan machan.*");
        }

        await react("🆔");

        if (isGroup) {
            // Group JID eka
            const groupJID = from.includes('@g.us') ? from : `${from}@g.us`;
            return reply(`👥 *DARK DEV MINI GROUP JID*\n\n\`\`${groupJID}\`\n\n> *© DARK DEV MINI*`);
        } else {
            // User JID eka
            const userJID = sender.includes('@s.whatsapp.net') ? sender : `${sender}@s.whatsapp.net`;
            return reply(`👤 *DARK DEV MINI USER JID*\n\n\`\`${userJID}\`\n\n> *© DARK DEV MINI*`);
        }

    } catch (e) {
        console.error("JID Error:", e);
        await react("❌");
        reply(`⚠️ Error: ${e.message}`);
    }
});