const { cmd } = require("../inconnuboy");
const config = require("../config");
const Boom = require('@hapi/boom');
const { DisconnectReason } = require('@whiskeysockets/baileys');

let reconnectAttempts = 0;
let pingInterval;
let keepAliveInterval;
let isConnected = false;

// Status check command
cmd({
    pattern: "status",
    alias: ["botstatus", "uptime", "online"],
    desc: "Bot online status balanna",
    category: "owner",
    react: "💚",
    filename: __filename
}, async(conn, mek, m, { from, reply, react }) => {
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    
    await react(isConnected ? "💚" : "❌");
    reply(`*💚 DARK DEV MINI STATUS*\n\n🟢 Connection: ${isConnected ? 'ONLINE' : 'OFFLINE'}\n⏰ Uptime: ${h}h ${m}m ${s}s\n🔄 Reconnects: ${reconnectAttempts}\n📡 Last Ping: Just now\n✅ Anti-Offline: ACTIVE`);
});

// Main anti-offline setup - index.js eke conn hadana passe call karapan
function antiOffline(conn) {
    
    // 1. KEEPALIVE - 10s walata 1 ping. WhatsApp cut karanne na
    if (keepAliveInterval) clearInterval(keepAliveInterval);
    keepAliveInterval = setInterval(async () => {
        try {
            if (conn.user && isConnected) {
                await conn.sendPresenceUpdate('available');
                await conn.query({
                    tag: 'iq',
                    attrs: {
                        to: 's.whatsapp.net',
                        type: 'get',
                        xmlns: 'w:p'
                    }
                });
            }
        } catch (e) {
            console.log('Keepalive error:', e.message);
        }
    }, 10000); // 10 seconds
    
    // 2. PING KEEPER - 30s walata 1 presence update
    if (pingInterval) clearInterval(pingInterval);
    pingInterval = setInterval(async () => {
        try {
            if (conn.user && isConnected) {
                await conn.sendPresenceUpdate('composing');
                setTimeout(() => conn.sendPresenceUpdate('available'), 3000);
                console.log('💚 Ping sent - Bot alive');
            }
        } catch (e) {}
    }, 30000); // 30 seconds
    
    // 3. CONNECTION LISTENER - disconnect unoth auto reconnect
    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'open') {
            isConnected = true;
            reconnectAttempts = 0;
            console.log('💚 Bot ONLINE! Anti-offline active');
            
        } else if (connection === 'close') {
            isConnected = false;
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            console.log('❌ Disconnected! Reason:', reason);
            
            if (reason === DisconnectReason.loggedOut) {
                console.log('Session expired! QR scan karapan.');
                return;
            }
            
            // Winadi 10 offline nawaththanna - fast reconnect
            reconnectAttempts++;
            const delay = Math.min(3000 * reconnectAttempts, 10000); // Max 10s witharak
            
            console.log(`🔄 Reconnecting in ${delay/1000}s...`);
            setTimeout(() => {
                conn.connect().catch(() => {});
            }, delay);
        }
    });
    
    // 4. ERROR HANDLER - error unath reconnect
    conn.ev.on('error', (err) => {
        console.log('Error caught:', err.message);
        if (!isConnected) {
            setTimeout(() => conn.connect().catch(() => {}), 5000);
        }
    });
}

module.exports = { antiOffline };

// === INDEX.JS EKE ME WAGE DAPAN === 
/*
const { antiOffline } = require('./plugins/antioffline');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    
    const conn = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        browser: ['INCONNU BOY TECH', 'Chrome', '1.0.0'],
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000, // MEKA THAMAI MAIN EKA - 10s
        markOnlineOnConnect: true,
        syncFullHistory: false,
        retryRequestDelayMs: 2000,
        maxRetries: 15
    });
    
    conn.ev.on('creds.update', saveCreds);
    antiOffline(conn); // Anti-offline activate karapan
    
    return conn;
}
*/
