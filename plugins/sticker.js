const { cmd } = require('../inconnuboy'); // ඔබේ නවතම cmd format එකට අනුව
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const sharp = require("sharp");
const fs = require("fs");
const { getRandom } = require("../lib/functions");
const { createCanvas, registerFont } = require("canvas");

// Fonts (ඔබේ මාර්ගයන් නිවැරදිදැයි තහවුරු කරගන්න)
registerFont("./assets/fonts/NotoSansSinhala-Bold.ttf", { family: "SinhalaBold" });
registerFont("./assets/fonts/Roboto-Bold.ttf", { family: "RobotoBold" });

// --- Helper Functions ---
async function makeRoundedPng(inputBuffer, { shape = "circle", radius = 96 } = {}) {
  const size = 512;
  let svgMask;
  if (shape === "circle") {
    svgMask = Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#fff"/></svg>`);
  } else if (shape === "rounded") {
    const r = Math.max(0, Math.min(radius, 256));
    svgMask = Buffer.from(`<svg width="${size}" height="${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="${r}" ry="${r}" fill="#fff"/></svg>`);
  } else {
    return await sharp(inputBuffer).resize(size, size, { fit: "cover" }).png().toBuffer();
  }
  return await sharp(inputBuffer).resize(size, size, { fit: "cover" }).composite([{ input: svgMask, blend: "dest-in" }]).png().toBuffer();
}

async function makeTextPng(text) {
  const size = 512;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, size, size);
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  const maxWidth = 420;
  let fontSize = 80;
  const fontFamily = "SinhalaBold, RobotoBold, Sans-Serif";
  while (fontSize > 28) {
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    fontSize -= 4;
  }
  ctx.fillStyle = "#00AAFF";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = Math.max(2, Math.round(fontSize / 14));
  ctx.strokeStyle = "rgba(0,0,0,0.7)";
  ctx.strokeText(text, size / 2, size / 2);
  ctx.fillText(text, size / 2, size / 2);
  return canvas.toBuffer("image/png");
}

function parseShapeOptions(q = "") {
  const o = { shape: "circle", radius: 96 };
  if (q.includes("--rounded")) o.shape = "rounded";
  if (q.includes("--square")) o.shape = "square";
  if (q.includes("--circle")) o.shape = "circle";
  const m = q.match(/--radius=(\d{1,3})/);
  if (m) o.radius = parseInt(m[1], 10);
  return o;
}

// --- Sticker Command ---
cmd({
  pattern: 'sticker',
  alias: ['s', 'ss', 'stic'],
  desc: 'Convert photo/sticker/text into a rounded sticker.',
  category: 'tools',
  react: '🤹‍♀️'
}, async (conn, mek, m, { from, quoted, q, reply, pushname }) => {
  try {
    const qType = quoted?.mtype || quoted?.type;
    const isQuotedImage = (qType && /imageMessage$/.test(qType)) || (qType === "viewOnceMessage" && (quoted?.msg?.type === "imageMessage" || quoted?.msg?.mimetype?.startsWith?.("image/")));
    const isQuotedSticker = qType === "stickerMessage";
    const opts = parseShapeOptions(q);

    // Image logic
    if (m?.type === "imageMessage" || isQuotedImage) {
      reply("⏳ Making your rounded sticker...");
      const imageBuffer = isQuotedImage ? await quoted.download() : await m.download();
      const roundedPng = await makeRoundedPng(imageBuffer, opts);
      const st = new Sticker(roundedPng, { pack: pushname || "danuwa-MD", author: "danuka dissnayake", type: StickerTypes.FULL, quality: 100, background: "transparent" });
      await conn.sendMessage(from, { sticker: await st.toBuffer() }, { quoted: mek });
      return reply("✅ Rounded sticker created!");
    }

    // Sticker logic
    if (isQuotedSticker) {
      reply("⏳ Re-shaping sticker...");
      const stickerBuffer = await quoted.download();
      const png = await sharp(stickerBuffer).png().toBuffer();
      const roundedPng = await makeRoundedPng(png, opts);
      const st = new Sticker(roundedPng, { pack: pushname || "danuwa-MD", author: "danuwa Chanushka", type: StickerTypes.FULL, quality: 100, background: "transparent" });
      await conn.sendMessage(from, { sticker: await st.toBuffer() }, { quoted: mek });
      return reply("✅ Sticker rounded!");
    }

    // Text logic
    if (q && q.trim().length > 0) {
      reply("⏳ Creating Sinhala/Text sticker...");
      const pngText = await makeTextPng(q.trim());
      const roundedPng = await makeRoundedPng(pngText, opts);
      const st = new Sticker(roundedPng, { pack: pushname || "danuwa-MD", author: "danuwa Chanushka", type: StickerTypes.FULL, quality: 100, background: "transparent" });
      await conn.sendMessage(from, { sticker: await st.toBuffer() }, { quoted: mek });
      return reply("✅ Sinhala/Text sticker created!");
    }

    return reply("⚠️ Reply to image/sticker or type text.\nOptions: `--circle` | `--rounded` | `--square` | `--radius=80`");
  } catch (e) {
    return reply('*❌ Error: ' + e.message + '*');
  }
});
