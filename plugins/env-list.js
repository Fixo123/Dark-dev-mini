const config = require('../config');
const { cmd } = require('../inconnuboy');
const { runtime } = require('../lib/functions');

function isEnabled(value) {
    return value && value.toString().toLowerCase() === "true";
}

cmd({
    pattern: "env",
    alias: ["setting", "allvar", "settings"],
    desc: "Displays bot settings",
    category: "menu",
    react: "⚙️",
    filename: __filename
}, async(conn, mek, m, { from, reply, react, sender }) => {
    try {
        await react("⚙️");

        let envSettings = `*⚙️ DARK DEV MINI SETTINGS ⚙️*

┏━━━━━━━━━━
┣ 🔹 *status_view:* ${isEnabled(config.AUTO_STATUS_SEEN) ? "On ✅" : "Off ❌"}  
┣ 🔹 *status_reply:* ${isEnabled(config.AUTO_STATUS_REPLY) ? "On ✅" : "Off ❌"}  
┣ 🔹 *auto_reply:* ${isEnabled(config.AUTO_REPLY) ? "On ✅" : "Off ❌"}  
┣ 🔹 *auto_sticker:* ${isEnabled(config.AUTO_STICKER) ? "On ✅" : "Off ❌"}  
┣ 🔹 *auto_voice:* ${isEnabled(config.AUTO_VOICE) ? "On ✅" : "Off ❌"}  
┣ 🔹 *custom_reacts:* ${isEnabled(config.CUSTOM_REACT) ? "On ✅" : "Off ❌"}  
┣ 🔹 *auto_react:* ${isEnabled(config.AUTO_REACT) ? "On ✅" : "Off ❌"}  
┣ 🔹 *delete_links:* ${isEnabled(config.DELETE_LINKS) ? "On ✅" : "Off ❌"}  
┣ 🔹 *anti_link:* ${isEnabled(config.ANTI_LINK) ? "On ✅" : "Off ❌"}  
┣ 🔹 *anti_bad:* ${isEnabled(config.ANTI_BAD) ? "On ✅" : "Off ❌"}  
┣ 🔹 *auto_typing:* ${isEnabled(config.AUTO_TYPING) ? "On ✅" : "Off ❌"}  
┣ 🔹 *auto_recording:* ${isEnabled(config.AUTO_RECORDING) ? "On ✅" : "Off ❌"}  
┣ 🔹 *always_online:* ${isEnabled(config.ALWAYS_ONLINE) ? "On ✅" : "Off ❌"}  
┣ 🔹 *mode:* ${isEnabled(config.PUBLIC_MODE) ? "Public 🌍" : "Private 🔒"}  
┣ 🔹 *read_message:* ${isEnabled(config.READ_MESSAGE) ? "On ✅" : "Off ❌"}  
┣ 🔹 *status_react:* ${isEnabled(config.AUTO_STATUS_REACT) ? "On ✅" : "Off ❌"}  
┣ 🔹 *welcome:* ${isEnabled(config.WELCOME) ? "On ✅" : "Off ❌"}  
┣ 🔹 *admin_events:* ${isEnabled(config.ADMIN_EVENTS) ? "On ✅" : "Off ❌"}  
┗━━━━━━━━━━

📝 *Description:* ${config.DESCRIPTION || 'No description set'}
⏱️ *Uptime:* ${runtime(process.uptime())}
👨‍💻 *Owner:* DARK DEV MINI`;

        await conn.sendMessage(
            from,
            {
                image: { url: 'https://files.catbox.moe/on64af.png' },
                caption: envSettings,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363420828095666@newsletter',
                        newsletterName: "DARK DEV MINI",
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

        await react("✅");

    } catch (error) {
        console.log(error);
        await react("❌");
        reply(`❌ *Error:* ${error.message}`);
    }
});