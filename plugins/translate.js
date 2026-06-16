const { cmd } = require('../inconnuboy');
const translate = require('@vitalets/google-translate-api');

// ── TRANSLATE PLUGIN ──
cmd({
    pattern: 'translate',
    alias: ['tr'],
    desc: 'Translate text to another language',
    category: 'tools',
    react: '🌐'
}, async (conn, mek, m, { from, q, reply, args }) => {
    try {
        // උදාහරණ: .translate en සිංහලෙන් ලියන ලද වාක්‍යය
        if (!q) return reply('*❌ Please provide text and language code.*\n\nExample: `.translate en Hello` (To translate to English)');

        const [langCode, ...textParts] = args;
        const text = textParts.join(' ');

        if (!text) return reply('*❌ Please provide the text to translate.*');

        const result = await translate(text, { to: langCode });

        const message = `
╭━━❰ 🌐 *TRANSLATOR* ❱━━╮
┃ 📝 *Original:* ${text}
┃ 🌍 *Translated:* ${result.text}
╰━━━━━━━━━━━━━━━╯`;

        await reply(message);
    } catch (e) {
        console.error(e);
        reply('*❌ Translation failed. Check your language code (e.g., en, si, ta, hi).*');
    }
});
