const { cmd } = require('../inconnuboy');
const Jimp = require('jimp');

cmd({
    pattern: "fullpp",
    alias: ["setpp", "fulldp"],
    react: "🖼️",
    desc: "Set full image as bot's profile picture",
    category: "tools",
    filename: __filename,
    use: ".fullpp [reply to image]"
},
async(conn, mek, m, { from, reply, react, sender }) => {
    try {
        // ✅ Bot eka witharak use karanna puluwan
        const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
        if (m.sender!== botNumber) {
            await react("❌");
            return reply('❌ *Bot eka witharak me command eka use karanna puluwan machan.*');
        }

        const quoted = m.quoted;
        if (!quoted ||!quoted.mtype ||!quoted.mtype.includes('image')) {
            await react("⚠️");
            return reply('⚠️ *Image ekakata reply karala.fullpp gahapan machan.*');
        }

        await react("⏳");
        await reply('⏳ *Image process karanawa, tikak wait karanna...*');

        const media = await conn.downloadMediaMessage(quoted);
        const image = await Jimp.read(media);

        const size = 640; // WhatsApp DP resolution
        const bg = image.clone().cover(size, size).blur(10); // blurred background
        const fg = image.clone().contain(size, size); // original image center

        bg.composite(fg, 0, 0); // Merge foreground over background

        const buffer = await bg.getBufferAsync(Jimp.MIME_JPEG);

        await conn.updateProfilePicture(botNumber, buffer);

        await react("✅");
        await reply('✅ *Bot eke profile picture eka full DP format ekata set kala!*\n\n> *© DARK DEV MINI*');

    } catch (err) {
        console.error(err);
        await react("❌");
        reply(`❌ *Error:* ${err.message || "DP set karanna bari una"}`);
    }
});