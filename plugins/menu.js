const { cmd, commands } = require('../inconnuboy');
const { getUserConfigFromMongoDB } = require('../lib/database');
const config = require('../config');

cmd({
    pattern: 'menu',
    alias: ['help', 'cmds', 'commands'],
    desc: 'Show all commands by category',
    category: 'general',
    react: '📋'
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const number = sender.split('@')[0];
        const userConfig = await getUserConfigFromMongoDB(number) || {};

        // ON/OFF with cute icons
        const statusIcon = (val) => val === 'true'? '💚 ON' : '💔 OFF';

        // Group commands
        const categories = {};
        for (const cmd of commands) {
            if (cmd.dontAddCommandList) continue;
            const cat = (cmd.category || 'misc').toLowerCase();
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(cmd);
        }

        const categoryEmojis = {
            general: '🌐', group: '👥', settings: '⚙️', owner: '👑',
            tools: '🔧', fun: '🎭', media: '🎬', misc: '📦'
        };

        // Uptime cute format
        const uptime = process.uptime();
        const h = Math.floor(uptime / 3600);
        const m = Math.floor((uptime % 3600) / 60);
        const s = Math.floor(uptime % 60);

        // Cute Header
        let menuText = `✨🦋 *DARK DEV MINI* 🦋✨\n`;
        menuText += `╭─────────────╮\n`;
        menuText += `│ 🌸 *Bot Menu* 🌸\n`;
        menuText += `╰─────────────╯\n\n`;
        menuText += `👋 Hi *${m.pushName || 'Cutie'}* ~!\n\n`;
        menuText += `🎀 *Bot Info* 🎀\n`;
        menuText += `⚡ Prefix : 「 ${config.PREFIX} 」\n`;
        menuText += `⏰ Uptime : ${h}h ${m}m ${s}s\n`;
        menuText += `🔌 Mode : ${config.WORK_TYPE?.toUpperCase() || 'PUBLIC'} ✨\n\n`;

        // Settings with cute borders
        menuText += `🎀 *Bot Settings* 🎀\n`;
        menuText += `┌─ 💕 Auto Features ─\n`;
        menuText += `│ 👁️ View Status : ${statusIcon(userConfig.AUTO_VIEW_STATUS)}\n`;
        menuText += `│ 📵 Anti Call : ${statusIcon(userConfig.ANTI_CALL)}\n`;
        menuText += `│ 🎙️ Auto Record : ${statusIcon(userConfig.AUTO_RECORDING)}\n`;
        menuText += `│ ⌨️ Auto Typing : ${statusIcon(userConfig.AUTO_TYPING)}\n`;
        menuText += `│ ✅ Auto Read : ${statusIcon(userConfig.READ_MESSAGE)}\n`;
        menuText += `└───────────────\n\n`;

        // Commands list cute style
        const catOrder = ['general', 'group', 'settings', 'owner', 'tools', 'media', 'fun', 'misc'];
        const sortedCats = [...catOrder.filter(c => categories[c]),...Object.keys(categories).filter(c =>!catOrder.includes(c))];

        for (const cat of sortedCats) {
            if (!categories[cat] ||!categories[cat].length) continue;
            const emoji = categoryEmojis[cat] || '📦';

            menuText += `🎀 ${emoji} *${cat.toUpperCase()}* 🎀\n`;
            menuText += `╭──────────────\n`;

            categories[cat].forEach((c, i) => {
                const dot = i % 2 === 0? '🌷' : '🌸';
                menuText += `│ ${dot} ${config.PREFIX}${c.pattern}`;
                if (c.desc) menuText += `\n│ 💬 ${c.desc}`;
                menuText += `\n`;
            });
            menuText += `╰──────────────\n\n`;
        }

        menuText += `💖 *Use:* ${config.PREFIX}command for help\n`;
        menuText += `🌟 ${config.BOT_FOOTER} 🌟`;

        await conn.sendMessage(from, {
            image: { url: config.IMAGE_PATH },
            caption: menuText,
            footer: '✨ Tap buttons below ✨',
            buttons: [
                { buttonId: `${config.PREFIX}ping`, buttonText: { displayText: '⚡ Ping Me' }, type: 1 },
                { buttonId: `${config.PREFIX}alive`, buttonText: { displayText: '💫 Alive?' }, type: 1 }
            ],
            headerType: 4
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply('❌ Menu error: ' + e.message);
    }
});
