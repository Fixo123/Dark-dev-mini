const { cmd } = require('../inconnuboy');
const axios = require('axios');
const yts = require('yt-search');
const { toAudio } = require('../lib/converter');

const AXIOS_DEFAULTS = {
    timeout: 60000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
    }
};

async function tryRequest(getter, attempts = 3) {
    let lastError;
    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            return await getter();
        } catch (err) {
            lastError = err;
            if (attempt < attempts) await new Promise(r => setTimeout(r, 1000 * attempt));
        }
    }
    throw lastError;
}

// ── SONG DOWNLOADER ──
cmd({
    pattern: 'song',
    desc: 'Download songs from YouTube',
    category: 'download',
    react: '🎵'
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const query = args.join(' ');
        if (!query) return reply('*❌ Please provide a song name or YouTube link.*');

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        let video;
        if (query.includes('youtube.com') || query.includes('youtu.be')) {
            video = { url: query, title: 'YouTube Audio', thumbnail: 'https://i.postimg.cc/y6GV9P3H/file-000000004c307206bc366893b817568c-(1).png' };
        } else {
            const search = await yts(query);
            if (!search || !search.videos.length) return reply('*❌ No results found.*');
            video = search.videos[0];
        }

        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: `🎵 Downloading: *${video.title}*\n⏱ Duration: ${video.timestamp || 'N/A'}`
        }, { quoted: mek });

        // API Methods
        const apiMethods = [
            { name: 'EliteProTech', url: (u) => `https://eliteprotech-apis.zone.id/ytdown?url=${encodeURIComponent(u)}&format=mp3` },
            { name: 'Yupra', url: (u) => `https://api.yupra.my.id/api/downloader/ytmp3?url=${encodeURIComponent(u)}` }
        ];

        let audioBuffer;
        let downloadSuccess = false;
        let finalTitle = video.title;

        for (const api of apiMethods) {
            try {
                const res = await tryRequest(() => axios.get(api.url(video.url), AXIOS_DEFAULTS));
                const dlUrl = res.data.downloadURL || res.data.data?.download_url || res.data.dl;
                
                if (dlUrl) {
                    const audioResponse = await axios.get(dlUrl, { responseType: 'arraybuffer', timeout: 120000 });
                    audioBuffer = Buffer.from(audioResponse.data);
                    downloadSuccess = true;
                    break;
                }
            } catch (e) { continue; }
        }

        if (!downloadSuccess) return reply('*❌ All download sources failed.*');

        // Convert if not mp3
        const firstBytes = audioBuffer.slice(0, 4).toString('hex');
        let finalBuffer = audioBuffer;
        if (!firstBytes.startsWith('494433')) { // ID3 tag check
            finalBuffer = await toAudio(audioBuffer, 'mp4');
        }

        await conn.sendMessage(from, {
            audio: finalBuffer,
            mimetype: 'audio/mpeg',
            fileName: `${finalTitle.replace(/[^\w\s-]/g, '')}.mp3`,
            ptt: false
        }, { quoted: mek });

    } catch (e) {
        reply('*❌ Error: ' + e.message + '*');
    }
});
