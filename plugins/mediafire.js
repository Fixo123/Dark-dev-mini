const { cmd } = require('../inconnuboy');
const axios = require('axios');
const cheerio = require('cheerio');

// ── MEDIAFIRE DOWNLOADER ──
cmd({
    pattern: 'mediafire',
    alias: ['mf', 'mfire'],
    desc: 'Download files from MediaFire',
    category: 'download',
    react: '📂'
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const url = args[0];
        if (!url) return reply('*❌ Please provide a MediaFire link.*');
        
        await reply('*⏳ Analyzing MediaFire link...*');
        
        const res = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.5481.178 Safari/537.36'
            }
        });
        
        const $ = cheerio.load(res.data);
        const downloadUrl = $('#downloadButton').attr('href');
        const fileName = $('.dl-info .promo_ss_file_name').text().trim() || 'file';
        const fileSize = $('.dl-info .promo_ss_file_size').text().trim() || 'Unknown';

        if (downloadUrl) {
            const caption = `╭━━━〔 𝗠𝗘𝗗𝗜𝗔𝗙𝗜𝗥𝗘 𝗗𝗟 〕━━━┈⊷\n` +
                          `┃ 📝 *FILE NAME:* ${fileName}\n` +
                          `┃ ⚖️ *FILE SIZE:* ${fileSize}\n` +
                          `╰━━━━━━━━━━━━━━━━━━┈⊷`;
            
            await conn.sendMessage(from, { 
                document: { url: downloadUrl }, 
                mimetype: 'application/octet-stream',
                fileName: fileName,
                caption: caption
            }, { quoted: mek });
            
        } else {
            reply('*❌ Failed to fetch MediaFire file. Please check the link.*');
        }
    } catch (e) {
        reply('*❌ Error: ' + e.message + '*');
    }
});
