const config = require('../config');
const { cmd } = require('../command');
const { ytsearch, ytmp3, ytmp4 } = require('@dark-yasiya/yt-dl.js'); 

// video

cmd({ 
    pattern: "video", 
    alias: ["video", "video"], 
    react: "🎥", 
    desc: "Download Youtube song", 
    category: "main", 
    use: '.song < Yt url or Name >', 
    filename: __filename 
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
    try { 
        if (!q) return await reply("Please provide a YouTube URL or song name.");
        
        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("No results found!");
        
        let yts = yt.results[0];  
        let apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(yts.url)}`;
        
        let response = await fetch(apiUrl);
        let data = await response.json();
        
        if (data.status !== 200 || !data.success || !data.result.download_url) {
            return reply("Failed to fetch the video. Please try again later.");
        }
        
        let ytmsg = `*🎞️ FIXO-XMD YT VIDEO DOWNLOADER 🎞️*
        
╭━━❐━⪼
┇๏ *Title* -  ${yts.title}
┇๏ *Duration* - ${yts.timestamp}
┇๏ *Views* -  ${yts.views}
┇๏ *Author* -  ${yts.author.name}
╰━━❑━⪼`;

        // Send video details
        await conn.sendMessage(from, { image: { url: data.result.thumbnail || '' }, caption: ytmsg }, { quoted: mek });
        
        // Send video file
        await conn.sendMessage(from, { video: { url: data.result.download_url }, mimetype: "video/mp4" }, { quoted: mek });
        
        // Send document file (optional)
        await conn.sendMessage(from, { 
            document: { url: data.result.download_url }, 
            mimetype: "video/mp4", 
            fileName: `${data.result.title}.mp4`, 
            caption: `> *${yts.title}*\n> *© Pᴏᴡᴇʀᴇᴅ Bʏ 𝐅ɪxᴏ 𝐗ᴍᴅ ♡*`
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("An error occurred. Please try again later.");
    }
});  
       
// play

cmd({ 
     pattern: "play", 
     alias: ["play", "play"], 
     react: "🎶", 
     desc: "Download Youtube song",
     category: "main", 
     use: '.song < Yt url or Name >', 
     filename: __filename }, 
     async (conn, mek, m, { from, prefix, quoted, q, reply }) => 
     
     { try { if (!q) return await reply("Please provide a YouTube URL or song name.");

const yt = await ytsearch(q);
    if (yt.results.length < 1) return reply("No results found!");
    
    let yts = yt.results[0];  
    let apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(yts.url)}`;
    
    let response = await fetch(apiUrl);
    let data = await response.json();
    
    if (data.status !== 200 || !data.success || !data.result.downloadUrl) {
        return reply("Failed to fetch the audio. Please try again later.");
    }
    
    let ytmsg = `*🎧 FIXO-XMD YT MP3 DOWNLOADER 🎧*
    
╭━━❐━⪼
┇๏ *Tital* -  ${yts.title}
┇๏ *Duration* - ${yts.timestamp}
┇๏ *Views* -  ${yts.views}
┇๏ *Author* -  ${yts.author.name} 
╰━━❑━⪼
> *© Pᴏᴡᴇʀᴇᴅ Bʏ 𝐅ɪxᴏ 𝐗ᴍᴅ ♡*`;



// Send song details
    await conn.sendMessage(from, { image: { url: data.result.image || '' }, caption: ytmsg }, { quoted: mek });
    
    // Send audio file
    await conn.sendMessage(from, { audio: { url: data.result.downloadUrl }, mimetype: "audio/mpeg" }, { quoted: mek });
    
    // Send document file
    await conn.sendMessage(from, { 
        document: { url: data.result.downloadUrl }, 
        mimetype: "audio/mpeg", 
        fileName: `${data.result.title}.mp3`, 
        caption: `> *© Pᴏᴡᴇʀᴇᴅ Bʏ 𝐅ɪxᴏ 𝐗ᴍᴅ ♡*`
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply("An error occurred. Please try again later.");
}

});

// Mp3 Url

cmd({
    pattern: "mp3",
    alias: ["mp3"],
    react: "🎛️",
    desc: "Download YouTube song",
    category: "main",
    use: ".play <song name>",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("🎵  Please type the song name, e.g. *.play Tum Hi Ho*");

        /* 1️⃣  Search YouTube */
        const yt = await ytsearch(q);
        if (!yt?.results?.length) return reply("❌  No YouTube results found.");

        const vid   = yt.results[0];           // first result
        const yurl  = vid.url;                 // full YouTube link
        const thumb = vid.thumbnail || "";     // fallback if missing

        /* 2️⃣  Hit Sparky’s MP3 API */
        const api   = `https://api-aswin-sparky.koyeb.app/api/downloader/song?search=${encodeURIComponent(yurl)}`;
        const res   = await fetch(api);
        const json  = await res.json();

        if (!json?.status || !json?.data?.downloadURL)
            return reply("❌  Failed to fetch the song. Try again later.");

        /* 3️⃣  Pretty caption */
        const caption =
`*🎛️  FIXO-XMD YT MP3 DOWNLOADER  🎛️*

╭━━❐━⪼
┇๏ *Title*    –  ${vid.title}
┇๏ *Duration* –  ${vid.timestamp}
┇๏ *Views*    –  ${vid.views}
┇๏ *Author*   –  ${vid.author.name}
╰━━❑━⪼
> *© Powered By 𝐅ɪxᴏ 𝐗ᴍᴅ ♡*`;

        /* 4️⃣  Send thumbnail + details */
        await conn.sendMessage(from,
            { image: { url: thumb }, caption },
            { quoted: mek });

        /* 5️⃣  Send playable audio */
        await conn.sendMessage(from,
            { audio: { url: json.data.downloadURL }, mimetype: "audio/mpeg" },
            { quoted: mek });

        /* 6️⃣  Send downloadable document */
        await conn.sendMessage(from,
            {
                document: { url: json.data.downloadURL },
                mimetype: "audio/mpeg",
                fileName: `${json.data.title || vid.title}.mp3`,
                caption: "> *© Powered By 𝐅ɪxᴏ 𝐗ᴍᴅ ♡*"
            },
            { quoted: mek });

    } catch (err) {
        console.error(err);
        reply("⚠️  An unexpected error occurred. Please try again later.");
    }
});

// Mp4 url

cmd({ 
    pattern: "mp4", 
    alias: ["mp4"], 
    react: "🎞️", 
    desc: "Download YouTube video", 
    category: "main", 
    use: '.video <YouTube url or name>', 
    filename: __filename 
}, 
async (conn, mek, m, { from, q, reply }) => { 
    try { 
        if (!q) return reply("📽️ Please provide a YouTube URL or video name.");

        // Step 1: Search YouTube if a name is provided
        const yt = await ytsearch(q);
        if (!yt.results || yt.results.length < 1) return reply("❌ No results found!");

        let video = yt.results[0];
        let videoUrl = video.url;

        // Step 2: Call new video downloader API
        let apiUrl = `https://api-aswin-sparky.koyeb.app/api/downloader/ytv?url=${encodeURIComponent(videoUrl)}`;
        let response = await fetch(apiUrl);
        let json = await response.json();

        if (!json.status || !json.data || !json.data.downloadURL) {
            return reply("❌ Failed to fetch the video. Please try again.");
        }

        // Step 3: Prepare caption
        let caption = `*📽️ FIXO-XMD YT VIDEO DOWNLOADER 📽️*

╭━━❐━⪼
┇๏ *Title* - ${video.title}
┇๏ *Duration* - ${video.timestamp}
┇๏ *Views* - ${video.views}
┇๏ *Author* - ${video.author.name}
╰━━❑━⪼`;

        // Step 4: Send details thumbnail
        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption
        }, { quoted: mek });

        // Step 5: Send playable video
        await conn.sendMessage(from, {
            video: { url: json.data.downloadURL },
            mimetype: "video/mp4"
        }, { quoted: mek });

        // Step 6: Send downloadable video document
        await conn.sendMessage(from, {
            document: { url: json.data.downloadURL },
            mimetype: "video/mp4",
            fileName: `${json.data.title || video.title}.mp4`,
            caption: `> *${video.title}*\n> *© Powered By 𝐅ɪxᴏ 𝐗ᴍᴅ ♡*`
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("⚠️ An unexpected error occurred. Please try again.");
    }
});