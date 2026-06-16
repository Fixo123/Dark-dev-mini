const { cmd } = require('../inconnuboy');
const translate = require("@vitalets/google-translate-api");

// ── TRANSLATE ──
cmd({
    pattern: 'tr',
    alias: ['translate'],
    desc: 'Translate text to target language',
    category: 'tools',
    react: '🌐'
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("*❌ Please provide text and target language code!*\n\n_Example: .tr en ඔබට කෙසේද?_ 🌍");

        const [lang, ...textArray] = q.trim().split(" ");
        if (!lang || textArray.length === 0) {
            return reply("*❌ Invalid format!*\n_Use:_ *.tr en ඔබට කෙසේද?_ ✨");
        }

        const text = textArray.join(" ");
        const result = await translate(text, { to: lang });

        const response = `
🌐 *TRANSLATION RESULT* 🌐
────────────────────
📤 *Original*: ${text}
📥 *Translated (${lang})*: ${result.text}
🔄 *Detected Lang*: ${result.from.language.iso}
        `;

        return reply(response);
    } catch (e) {
        reply('*❌ Error: ' + e.message + '*');
    }
});
