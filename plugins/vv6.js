const { cmd } = require("../inconnuboy");

cmd({
  pattern: "save",
  alias: ["vv6", "vv", "❤️", "🤠", "😀", "🥹", "😇", "👍", "🤩", "😍"],
  react: '🪀',
  desc: "Forward quoted message to your DM",
  category: "utility",
  filename: __filename
}, async(conn, mek, m, { from, reply, react, sender }) => {
  try {
    await react("🪀");

    // Bot eka witharak use karanna puluwan
    const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    if (m.sender!== botNumber) {
      await react("❌");
      return await conn.sendMessage(from, {
        text: "❌ *Bot eka witharak me command eka use karanna puluwan machan.*"
      }, { quoted: mek });
    }

    if (!m.quoted) {
      await react("⚠️");
      return await conn.sendMessage(from, {
        text: "*🍁 Message ekakata reply karala.save gahapan machan!*"
      }, { quoted: mek });
    }

    await react("⏳");

    const buffer = await m.quoted.download();
    const mtype = m.quoted.mtype;
    const options = { quoted: mek };

    let messageContent = {};
    switch (mtype) {
      case "imageMessage":
        messageContent = {
          image: buffer,
          caption: m.quoted.text || `📸 *Saved by DARK DEV MINI*`,
          mimetype: m.quoted.mimetype || "image/jpeg"
        };
        break;
      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: m.quoted.text || `🎥 *Saved by DARK DEV MINI*`,
          mimetype: m.quoted.mimetype || "video/mp4"
        };
        break;
      case "audioMessage":
        messageContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: m.quoted.ptt || false
        };
        break;
      default:
        await react("❌");
        return await conn.sendMessage(from, {
          text: "❌ *Image, video, audio witharak save karanna puluwan machan.*"
        }, { quoted: mek });
    }

    await conn.sendMessage(m.sender, messageContent, options); // User ge DM ekata yawannawa
    await react("✅");

  } catch (error) {
    console.error("Forward Error:", error);
    await react("❌");
    await conn.sendMessage(from, {
      text: "❌ Error: " + error.message
    }, { quoted: mek });
  }
});