const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require("path");
const { cmd } = require("../inconnuboy");

cmd({
  pattern: "remini",
  alias: ["enhance", "hd", "clair"],
  react: '✨',
  desc: "Enhance photo quality using Remini AI",
  category: "utility",
  use: ".remini [reply to image]",
  filename: __filename
}, async(conn, mek, m, { from, quoted, reply, react, sender }) => {
  let tempFilePath = null;
  let outputPath = null;
  
  try {
    const quotedMsg = quoted || m;
    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';
    
    if (!mimeType || !mimeType.startsWith('image/')) {
      return reply("🖼️ *Remini AI Enhancer* 🖼️\n\n❌ Image ekakata reply karala `.remini` gahapan machan\n💡 *Supported:* JPEG, PNG");
    }

    await react("✨");
    await reply("🔄 Image upload karanawa...");

    const mediaBuffer = await quotedMsg.download();
    
    let extension = '';
    if (mimeType.includes('image/jpeg')) extension = '.jpg';
    else if (mimeType.includes('image/png')) extension = '.png';
    else return reply("❌ JPEG/PNG witharak support. Wena format try karanna.");

    // Temp file hadanawa
    tempFilePath = path.join(os.tmpdir(), `remini_${Date.now()}${extension}`);
    fs.writeFileSync(tempFilePath, mediaBuffer);

    // Catbox upload
    const form = new FormData();
    form.append('fileToUpload', fs.createReadStream(tempFilePath), `img${extension}`);
    form.append('reqtype', 'fileupload');

    const uploadResponse = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders(),
      timeout: 30000
    });

    const imageUrl = uploadResponse.data;
    fs.unlinkSync(tempFilePath);
    tempFilePath = null;

    if (!imageUrl || !imageUrl.startsWith('https')) {
      throw "Catbox upload failed";
    }

    await react("⬆️");
    await reply("🔄 AI eken HD karanawa, tikak wait karanna...");

    // API 3ta with fallback
    const apis = [
      `https://apis.davidcyriltech.my.id/remini?url=${encodeURIComponent(imageUrl)}`,
      `https://api.siputzx.my.id/api/ai/remini?url=${encodeURIComponent(imageUrl)}`,
      `https://api.betabotz.eu.org/api/tools/remini?url=${encodeURIComponent(imageUrl)}&apikey=BETA`
    ];

    let response;
    let success = false;
    
    for (const apiUrl of apis) {
      try {
        response = await axios.get(apiUrl, { 
          responseType: 'arraybuffer',
          timeout: 60000
        });
        if (response.data && response.data.length > 1000) {
          success = true;
          break;
        }
      } catch (e) {
        console.log(`API failed: ${apiUrl}`);
        continue;
      }
    }

    if (!success) throw "All APIs down. Later try karanna.";

    outputPath = path.join(os.tmpdir(), `remini_out_${Date.now()}.jpg`);
    fs.writeFileSync(outputPath, response.data);

    await react("✅");
    
    await conn.sendMessage(from, {
      image: fs.readFileSync(outputPath),
      caption: "✨ *DARK DEV MINI REMINI AI*\n\n📸 Image quality enhance kala\n> *© DARK DEV MINI*"
    }, { quoted: mek });

  } catch (error) {
    console.error('Remini Error:', error);
    await react("❌");
    await reply(`❌ Error: ${error.message || "Image enhance karanna bari una. Image eka podi karala balanna."}`);
  } finally {
    // Cleanup
    try {
      if (tempFilePath && fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
      if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    } catch {}
  }
});