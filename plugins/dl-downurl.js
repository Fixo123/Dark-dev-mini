const { cmd } = require('../inconnuboy');
const axios = require("axios");

// ── DIRECT DOWNLOADER ──
cmd({
    pattern: "download",
    alias: ["downurl"],
    use: ".download <link>",
    react: "⏳",
    desc: "Download file from direct link",
    category: "tools"
},
async (conn, mek, m, { from, args, reply }) => {
    try {
        const link = args.join(" ");
        if (!link) return reply("⚠️ *Please provide a valid direct link.*");

        const urlPattern = /^(https?:\/\/[^\s]+)/i;
        if (!urlPattern.test(link)) return reply("❌ *Invalid URL format.*");

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        // Fetching file metadata
        const head = await axios.head(link).catch(() => null);
        if (!head) return reply("❌ *Unable to reach the server. Please check the link.*");

        const contentType = head.headers['content-type'] || "application/octet-stream";
        const sizeBytes = head.headers['content-length'];
        const sizeMB = sizeBytes ? (sizeBytes / (1024 * 1024)).toFixed(2) + " MB" : "Unknown Size";

        // Info message
        const infoMsg = `
*「 URL DOWNLOADER 」*

┌───────────────────┐
  📂 *Format:* ${contentType.split('/')[1]?.toUpperCase() || 'DATA'}
  📦 *Size:* ${sizeMB}
  🔗 *Status:* Sending...
└───────────────────┘`;

        await reply(infoMsg);

        // Send file as document
        await conn.sendMessage(from, {
            document: { url: link },
            mimetype: contentType,
            fileName: `downloaded_file.${contentType.split('/')[1] || 'bin'}`,
            caption: `*✅ File successfully downloaded.*`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (err) {
        reply('*❌ Error: ' + err.message + '*');
    }
});
