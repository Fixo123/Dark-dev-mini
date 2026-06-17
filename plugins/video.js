const { cmd } = require('../inconnuboy');
const axios = require('axios');
const yts = require('yt-search');

const AXIOS_DEFAULTS = {
    timeout: 60000,
    headers: {
        'User-Agent': 'Mozilla/5.0',
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

// ── VIDEO DOWNLOADER ──
cmd({
    pattern: 'video',
    desc: 'Download videos from YouTube',
    category: 'download',
    react: '🎥'
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const query = args.join(' ');
        if (!query) return reply('*❌ Please provide a video name or YouTube link.*');

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        let videoUrl, videoTitle, videoThumbnail;

        if (query.includes('youtube.com') || query.includes('youtu.be')) {
            videoUrl = query;
            videoTitle = 'YouTube Video';
        } else {
            const { videos } = await yts(query);
            if (!videos || videos.length === 0) return reply('*❌ No videos found.*');
            videoUrl = videos[0].url;
            videoTitle = videos[0].title;
            videoThumbnail = videos[0].thumbnail;
        }

        await conn.sendMessage(from, {
            image: { url: videoThumbnail || 'https://i.postimg.cc/y6GV9P3H/file-000000004c307206bc366893b817568c-(1).png' },
            caption: `🎥 Downloading: *${videoTitle}*`
        }, { quoted: mek });

        // API Methods
        const apiMethods = [
            { name: 'EliteProTech', url: (u) => `https://eliteprotech-apis.zone.id/ytdown?url=${encodeURIComponent(u)}&format=mp4` },
            { name: 'Yupra', url: (u) => `https://api.yupra.my.id/api/downloader/ytmp4?url=${encodeURIComponent(u)}` }
        ];

        let videoData;
        let downloadSuccess = false;

        for (const api of apiMethods) {
            try {
                const res = await tryRequest(() => axios.get(api.url(videoUrl), AXIOS_DEFAULTS));
                const dlUrl = res.data.downloadURL || res.data.data?.download_url || res.data.result?.mp4;
                const title = res.data.title || res.data.data?.title || res.data.result?.title || videoTitle;

                if (dlUrl) {
                    videoData = { download: dlUrl, title: title };
                    downloadSuccess = true;
                    break;
                }
            } catch (e) { continue; }
        }

        if (!downloadSuccess) return reply('*❌ All download sources failed.*');

        await conn.sendMessage(from, {
            video: { url: videoData.download },
            mimetype: 'video/mp4',
            fileName: `${videoData.title.replace(/[^\w\s-]/g, '')}.mp4`,
            caption: `*${videoData.title}*\n\n> *Downloaded by OLD-STUDIO*`
        }, { quoted: mek });

    } catch (e) {
        reply('*❌ Error: ' + e.message + '*');
    }
});
