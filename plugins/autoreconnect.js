const { cmd } = require("../inconnuboy");
const config = require("../config");
const fs = require("fs");
const Boom = require('@hapi/boom');
const { DisconnectReason } = require('@whiskeysockets/baileys');

// Reconnect tracking
let reconnectCount = 0;
let lastPing = Date.now();
const MAX_RECONNECT = 15;
let pingInterval;

cmd({
    pattern: "autoreconnect",
    alias: ["antidc", "reconnectstatus", "keepalive"],
    desc: "Bot auto reconnect status + ping keeper",
    category: "owner",
    react: "🔄",
    filename: __filename
}, async(conn, mek, m, { from, reply, react }) => {
    try {
        const uptime = process.uptime();
        const h = Math.floor(uptime / 3600);
        const m = Math.floor((uptime % 3600) / 60);
        const s = Math.floor(uptime % 60);
        
        await react("🔄");
        reply(`*🔄 DARK DEV MINI - ANTI DISCONNECT*\n\n💖 Status: *Active* \n📊 Reconnect Count: ${reconnectCount}/${MAX_RECONNECT}\n⏰ Last Ping: ${Math.floor((Date.now() - lastPing)/1000)}s ago\n⏱️ Uptime: ${h}h ${m}m ${s}s\n✅ Bot eka disconnect unoth auto reconnect wenawa machan`);
    } catch (e) {
        reply("Error: " + e.message);
    }
});

// Ping keeper - harima min 30s walata 1 ping yawannawa
function startPingKeeper(conn) {
    if (pingInterval) clearInterval(pingInterval);
    
    pingInterval = setInterval(async () => {
        try {
            if (conn.user) {
                await conn.sendPresenceUpdate('available');
                lastPing = Date.now();
                console.log('💖 Ping sent to WhatsApp server');
            }
        } catch (e) {
            console.log('Ping error:', e.message);
        }
    }, 30000); // 30 sec walata 1 ping
}

// Connection update listener - meka main file eke conn create karana passe damma hari
function setupReconnect(conn) {
    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            const reasonMsg = lastDisconnect?.error?.message || 'Unknown';
            
            console.log('❌ Bot disconnected! Reason:', reason, reasonMsg);
            reconnectCount++;
            
            if (reason === DisconnectReason.loggedOut) {
                console.log('❌ Session logged out! QR scan karanna ona.');
                fs.rmSync('./session', { recursive: true, force: true });
                return;
            }
            
            if (reconnectCount <= MAX_RECONNECT) {
                const delay = Math.min(5000 * reconnectCount, 30000); // 5s -> 30s max
                console.log(`🔄 Reconnecting in ${delay/1000}s... Attempt ${reconnectCount}/${MAX_RECONNECT}`);
                
                setTimeout(() => {
                    console.log('🔄 Trying to reconnect...');
                    conn.connect();
                }, delay);
            } else {
                console.log('❌ Max reconnect attempts reached. Manual restart ona machan.');
            }
            
        } else if (connection === 'open') {
            console.log('✅ Bot connected successfully! 💖');
            reconnectCount = 0; // Reset count
            startPingKeeper(conn); // Ping keeper start karapan
        }
    });
    
    // Error handler
    conn.ev.on('error', (err) => {
        console.error('❌ Connection error:', err);
    });
}

module.exports = { setupReconnect };

// Bot start karana thana - index.js eke me wage damma nam hari
/*
const { setupReconnect } = require('./plugins/autoreconnect');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    
    const conn = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        browser: ['INCONNU BOY TECH', 'Chrome', '1.0.0'],
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000, // 10s walata keepalive
        markOnlineOnConnect: false,
        syncFullHistory: false,
        retryRequestDelayMs: 3000,
        maxRetries: 10,
        generateHighQualityLinkPreview: true
    });
    
    conn.ev.on('creds.update', saveCreds);
    
    // Reconnect setup eka call karapan
    setupReconnect(conn);
    
    return conn;
}
*/
