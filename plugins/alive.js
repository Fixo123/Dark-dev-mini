const { cmd, commands } = require('../inconnuboy');
const config = require('../config');

// Commande Ping
cmd({
    pattern: "ping",
    desc: "Check bot latency",
    category: "general",
    react: "⚙️"
},
async(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const startTime = Date.now();
        const message = await conn.sendMessage(from, { text: '*_⚡️ ᴘɪɴɢɪɴɢ ᴛᴏ sᴇʀᴠᴇʀ..._*' }, { quoted: mek });
        const endTime = Date.now();
        const ping = endTime - startTime;
        await conn.sendMessage(from, { text: `🏓 *Pong!*\n⚡ Latency: ${ping}ms` }, { quoted: message });
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// Commande Alive
cmd({
    pattern: "alive",
    desc: "Check if bot is alive",
    category: "general",
    react: "💖"
},
async(conn, mek, m, { from, reply }) => {
    try {
        const cuteImage = "https://files.catbox.moe/x94c6h.jpg"; // Cute heart/couple image
        
        const cuteCaption = `💖 *Hey, I'm right here for you...* 💖\n\n` +
                           `🌸 Dark Dev Mini bot is alive & happy ✨\n` +
                           `🥰 Just waiting for your message with a smile\n` +
                           `💫 Type any command... I'm all yours!\n\n` +
                           `> ${config.BOT_FOOTER}\n` +
                           `> Always by your side 💕`;

        await conn.sendMessage(from, { 
            image: { url: cuteImage },
            caption: cuteCaption
        }, { quoted: mek });
        
    } catch (e) {
        reply("Oops! Error: " + e.message);
    }
});
