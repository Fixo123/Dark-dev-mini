const { cmd } = require("../inconnuboy");
const config = require("../config");
const Boom = require('@hapi/boom');
const { DisconnectReason } = require('@whiskeysockets/baileys');

let reconnectAttempts = 0;
let pingInterval;
let keepAliveInterval;
let reconnectTimer;
let isConnected = false;
let lastActivity = Date.now();

// Status check command
cmd({
    pattern: "status",
    alias: ["botstatus", "uptime", "online", "antidc"],
    desc: "Bot online status + anti-offline status balanna",
    category: "owner",
    react: "💚",
    filename: __filename
}, async(conn, mek, m, { from, reply, react }) => {
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    const lastPingSec = Math.floor((Date.now() - lastActivity) / 1000);
    
    await react(isConnected ? "💚" : "❌");
    reply(`*💚 DARK DEV MINI STATUS*\n\n🟢 Connection: ${isConnected ? 'ONLINE ✅' : 'OFFLINE ❌'}\n⏰ Uptime: ${h}h ${m}m ${s}s\n🔄 Reconnects: ${reconnectAttempts}\n📡 Last Ping: ${lastPingSec}s ago\n🛡️ Anti-Offline: ACTIVE\nBot eka winadi 10 offline wenne na machan!`);
});

// Main anti-offline setup - index.js eke conn hadana passe call karapan
function antiOffline(conn) {
    
    // 1. SUPER KEEPALIVE - 8s walata 1 ping. Winadi 10 cut nawaththai machan
    if (keepAliveInterval) clearInterval(keepAliveInterval);
    keepAliveInterval = setInterval(async () => {
        try {
            if (conn.user && isConnected) {
                await conn.sendPresenceUpdate('available');
                await conn.query({tag: 'iq', attrs: {to: 's.whatsapp.net', type: 'get', xmlns: 'w:p'}});
                lastActivity = Date.now();
            }
        } catch (e) {
            console.log('Keepalive error:', e.message);
        }
    }, 8000); // 8 seconds - meka key eka
    
    // 2. SMART PING KEEPER - 20s walata composing -> available. WhatsApp hoyanne na idle kiyala
    if (pingInterval) clearInterval(pingInterval);
    pingInterval = setInterval(async () => {
        try {
            if (conn.user && isConnected) {
                await conn.sendPresenceUpdate('composing');
                setTimeout(() => conn.sendPresenceUpdate('available'), 2000);
                lastActivity = Date.now();
                console.log('💚 Ping sent - Bot alive');
            }
        } catch (e) {}
    }, 20000); // 20 seconds
    
    // 3. CONNECTION LISTENER - disconnect unoth 3s idala reconnect
    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'open') {
            isConnected = true;
            reconnectAttempts = 0;
            lastActivity = Date.now();
            console.log('💚 Bot ONLINE! Anti-offline ACTIVE');
            await conn.sendPresenceUpdate('available');
            
        } else if (connection === 'close') {
            isConnected = false;
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            const reasonText = lastDisconnect?.error?.message || 'Unknown';
            console.log(`❌ Disconnected! Reason: ${reason} - ${reasonText}`);
            
            if (reason === DisconnectReason.loggedOut) {
                console.log('❌ Session logged out! ./session folder delete karapan.');
                return;
            }
            
            if (reason === DisconnectReason.connectionClosed) {
                console.log('⚠️ Connection closed by server. Fast reconnect...');
            }
            
            // Winadi 10 offline nawaththanna - fast reconnect 3s
            reconnectAttempts++;
            const delay = 3000; // Fixed 3s delay. Max 10s yanne na
            
            clearTimeout(reconnectTimer);
            reconnectTimer = setTimeout(() => {
                console.log(`🔄 Reconnecting now... Attempt ${reconnectAttempts}`);
                conn.connect().catch(() => {});
            }, delay);
        }
    });
    
    // 4. ERROR HANDLER + HEARTBEAT CHECK
    conn.ev.on('error', (err) => {
        console.log('❌ Connection error:', err.message);
        if (!isConnected) {
            clearTimeout(reconnectTimer);
            reconnectTimer = setTimeout(() => conn.connect().catch(() => {}), 5000);
        }
    });
    
    // 5. HEARTBEAT - 60s walata 1 para check karala offline nam force reconnect
    setInterval(() => {
        if (isConnected && (Date.now() - lastActivity) > 60000) {
            console.log('⚠️ No activity for 60s. Force ping...');
            conn.sendPresenceUpdate('available').catch(() => {});
        }
    }, 60000);
}

module.exports = { antiOffline };

/* === INDEX.JS EKE ME WAGE DAPAN === 
const { antiOffline } = require('./plugins/antioffline');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();
    
    const conn = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true,
        browser: ['INCONNU BOY TECH', 'Chrome', '1.0.0'], // Chrome = Safari walata wada stable
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000, // Baileys built-in keepalive 10s
        markOnlineOnConnect: true,
        syncFullHistory: false,
        retryRequestDelayMs: 2000,
        maxRetries: 999
    });
    
    conn.ev.on('creds.update', saveCreds);
    antiOffline(conn); // Anti-offline activate karapan - MEKA MUST
    
    return conn;
}
*/
