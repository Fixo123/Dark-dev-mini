const { cmd, commands } = require('../inconnuboy');
const config = require('../config');
const os = require("os");
const { runtime } = require('../lib/functions');
const https = require("https");
const { execSync } = require("child_process");
const fs = require('fs');

// Helper Functions
function detectHostingPlatform() {
    if (process.env.RAILWAY_STATIC_URL) return 'Railway';
    if (process.env.REPL_ID) return 'Replit';
    if (process.env.HEROKU_APP_NAME || process.env.DYNO) return 'Heroku';
    if (process.env.RENDER) return 'Render';
    if (process.env.CODESPACES) return 'GitHub Codespaces';
    if (process.env.HOME?.includes('/home/container')) return 'VPS (Likely Ubuntu)';
    return os.hostname();
}

function getUptimeBar(seconds) {
    const totalBars = 10;
    const maxUptime = 24 * 60 * 60;
    const filledBars = Math.round((seconds / maxUptime) * totalBars);
    return '🟩'.repeat(filledBars) + '⬛'.repeat(totalBars - filledBars);
}

function getLinuxDistro() {
    try {
        const data = fs.readFileSync('/etc/os-release', 'utf-8');
        const nameLine = data.split('\n').find(line => line.startsWith('PRETTY_NAME='));
        return nameLine ? nameLine.split('=')[1].replace(/"/g, '') : 'Unknown Linux';
    } catch { return 'Unknown OS'; }
}

function getCPUUsage() {
    const cpus = os.cpus();
    let idle = 0, total = 0;
    cpus.forEach(core => {
        for (let type in core.times) total += core.times[type];
        idle += core.times.idle;
    });
    return `${100 - Math.round((idle / total) * 100)}%`;
}

function getDiskUsage() {
    try {
        return execSync("df -h / | awk 'NR==2 {print $3\" / \"$2}'").toString().trim() || 'Unavailable';
    } catch { return 'Unavailable'; }
}

function getPublicIP() {
    return new Promise((resolve) => {
        https.get('https://api.ipify.org', (res) => {
            let ip = '';
            res.on('data', chunk => ip += chunk);
            res.on('end', () => resolve(ip));
        }).on('error', () => resolve('Unavailable'));
    });
}

// Alive Command
cmd({
    pattern: "alive",
    desc: "Check if the bot is online and active",
    category: "general",
    react: "💫"
},
async(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const hostPlatform = detectHostingPlatform();
        const distro = getLinuxDistro();
        const ip = await getPublicIP();
        const ramUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const ramTotal = (os.totalmem() / 1024 / 1024).toFixed(2);
        const uptimeSeconds = process.uptime();
        const uptimeBar = getUptimeBar(uptimeSeconds);
        const uptimeText = runtime(uptimeSeconds);
        const cpuUsage = getCPUUsage();
        const diskUsage = getDiskUsage();

        const status = `*📡 DARK DEV MINI*

✅ *Status:* Active  
👑 *Owner:* ${config.OWNER_NAME}  
🧩 *Version:* 3.0.0  
🎯 *Mode:* ${config.MODE}  
🎛️ *Prefix:* ${config.PREFIX}

💾 *RAM:* ${ramUsed}MB / ${ramTotal}MB  
🧠 *CPU:* ${cpuUsage}  
💽 *Disk:* ${diskUsage}  
⏱️ *Uptime:* ${uptimeText}  
📊 *Bar:* ${uptimeBar}

🖥️ *Host:* ${hostPlatform}  
🐧 *OS:* ${distro}  
🌐 *IP:* ${ip}
__________________________________
${config.BOT_FOOTER}`;

        await conn.sendMessage(from, {
            image: { url: "https://files.catbox.moe/on64af.png" },
            caption: status,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 1000,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363421796655176@newsletter',
                    newsletterName: '𝗙𝗜𝗫𝗢 𝗫𝗠𝗗',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}`);
    }
});
