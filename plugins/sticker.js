const { cmd } = require('../inconnuboy');

cmd({
    pattern: 'sticker',
    alias: ['s'],
    desc: 'Convert image/video to sticker',
    category: 'convert',
    react: '🎨'
}, async (conn, mek, m, { from, isQuoted, quoted, reply }) => {
    try {
        // පින්තූරයක් හෝ වීඩියෝවක් ඇත්දැයි පරීක්ෂා කිරීම (Quoted හෝ Direct)
        const content = isQuoted ? quoted : mek;
        const mime = (content.msg || content).mimetype || '';

        if (!/image|video|webp/.test(mime)) {
            return reply('*❌ Please reply to an image or video to convert it into a sticker.*');
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        // මාධ්‍ය බාගත කිරීම (Download media buffer)
        const media = await conn.downloadAndSaveMediaMessage(content);

        // ස්ටිකර් එකක් ලෙස යැවීම
        await conn.sendMessage(from, { 
            sticker: { url: media },
            package: 'InconnuBot', // මෙතැන ඔබේ බොට්ගේ නම දෙන්න
            author: 'InconnuBoy' 
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
    } catch (e) {
        console.error(e);
        reply('*❌ An error occurred while creating the sticker.*');
    }
});
