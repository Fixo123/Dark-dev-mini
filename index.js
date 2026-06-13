const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { Boom } = require('@hapi/boom');
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pairRouter = require('./inconnu');
app.use('/', pairRouter);

// Express health check - UptimeRobot walata
app.get('/', (req, res) => {
    res.send('💚 DARK DEV MINI is ALIVE!');
});
app.get('/ping', (req, res) => {
    res.json({ status: 'online', uptime: process.uptime() });
});

let conn;
let isConnected = false;
let reconnectAttempts = 0;
let pingInterval;
let keepAliveInterval;

// Anti-Offline setup function
function antiOffline(socket) {
    
    // 1. KEEPALIVE - 8s walata 1 ping. Winadi 10 cut nawaththai
    if (keepAliveInterval) clearInterval(keepAliveInterval);
    keepAliveInterval = setInterval(async () => {
        if (socket.user && isConnected) {
            try {
                await socket.sendPresenceUpdate('available');
                await socket.query({tag: 'iq', attrs: {to: 's.whatsapp.net', type: 'get', xmlns: 'w:p'}});
            } catch (e) {}
        }
    }, 8000);
    
    // 2. PING KEEPER - 25s walata composing -> available
    if (pingInterval) clearInterval(pingInterval);
    pingInterval = setInterval(async () => {
        if (socket
