const { cmd } = require("../inconnuboy");
const config = require("../config");
const fs = require("fs");
const path = require("path");

// Reconnect count track karanna
let reconnectAttempts = 0;
const MAX_RECONNECT = 10;

cmd({
    pattern: "reconnect",
    alias: ["autoon", "autores"],
    desc: "Bot auto reconnect status balanna",
    category: "system",
    react: "🔄",
    filename: __filename
}, async(conn, mek, m, { from, reply, react }) => {
    try {
        await react("🔄");
        reply(`*INCONNU BOY TECH - AUTO RECONNECT*\n\n🔄 Status: Active\n📊 Retry Count: ${reconnectAttempts}\n⚡ Bot eka disconnect unoth auto join wenawa`);
    } catch (e) {
        reply("Error: " + e.message);
    }
});

// Connection update listener - meka main.part eke damma nam hari
conn.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    
    if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode!== DisconnectReason.loggedOut;
        
        console.log('❌ Bot disconnected:', lastDisconnect?.error?.message);
        reconnectAttempts++;
        
        if (shouldReconnect && reconnectAttempts <= MAX_RECONNECT) {
            console.log(`🔄 Reconnecting... Attempt ${reconnectAttempts}/${MAX_RECONNECT}`);
            
            // 5s idala reconnect
            setTimeout(() => {
                conn.connect();
            }, 5000);
            
        } else if (reconnectAttempts > MAX_RECONNECT) {
            console.log('❌ Max reconnect attempts reached. Session expired wenna athi.');
            // Session file delete karala QR scan karanna wenawa
        }
        
    } else if (connection === 'open') {
        console.log('✅ Bot connected successfully!');
        reconnectAttempts = 0; // Reset count
    }
});

const { DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');

// Main file eke connect karana thana me wage hadaganin:
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    
    const conn = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        browser: ['INCONNU BOY TECH', 'Chrome', '1.0.0'],
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000, // 10s walata ping yawannawa - disconnect wenne na
        markOnlineOnConnect: false,
        syncFullHistory: false,
        retryRequestDelayMs: 2500,
        maxRetries: 5
    });
    
    conn.ev.on('creds.update', saveCreds);
    
    // Reconnect listener eka methana damma
    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            
            if (reason === DisconnectReason.connectionClosed) {
                console.log("Connection closed, reconnecting...");
                startBot();
            } else if (reason === DisconnectReason.connectionLost) {
                console.log("Connection lost, reconnecting...");
                setTimeout(startBot, 3000);
            } else if (reason === DisconnectReason.restartRequired) {
                console.log("Restart required...");
                startBot();
            } else if (reason === DisconnectReason.timedOut) {
                console.log("Connection timed out...");
                setTimeout(startBot, 5000);
            } else if (reason === DisconnectReason.loggedOut) {
                console.log("Device logged out, scan QR again!");
                fs.rmSync('./session', { recursive: true, force: true });
            } else {
                console.log('Unknown disconnect reason:', reason);
                startBot();
            }
        }
    });
}

module.exports = { startBot };