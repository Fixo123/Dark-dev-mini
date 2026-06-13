const { cmd } = require('../inconnuboy');

// ── FAKE VOTE ──
cmd({
    pattern: 'fakevote',
    desc: 'Create a poll',
    category: 'group',
    react: '🗳️'
}, async (conn, mek, m, { from, isGroup, isAdmins, args, reply }) => {
    try {
        if (!isGroup) return reply('*❌ Group only command.*');
        if (!isAdmins) return reply('*❌ Only admins can create polls.*');

        const input = args.join(' ');
        if (!input.includes('|')) return reply('*❌ Please use the format: !fakevote Topic | Option1 | Option2*');

        const parts = input.split('|').map(o => o.trim());
        const pollName = parts[0];
        const options = parts.slice(1);

        if (options.length < 2) return reply('*❌ Please provide at least 2 options.*');

        // Poll එක යැවීම
        await conn.sendMessage(from, {
            poll: {
                name: pollName,
                values: options,
                selectableCount: 1
            }
        }, { quoted: mek });

        // Reaction එක යැවීම
        await conn.sendMessage(from, { 
            react: { text: '🗳️', key: mek.key } 
        });

    } catch (e) {
        reply('*❌ Error: ' + e.message + '*');
    }
});
