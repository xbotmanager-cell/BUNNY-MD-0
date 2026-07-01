import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  Browsers,
  fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';
import fs from 'fs';
import path from 'path';
import { logger } from './system/logger.js';
import { loadPlugins } from './system/loader.js';
import { router } from './system/router.js';
import { parseSessionId, fixExistingCreds } from './system/sessionParser.js';
import { loadDB } from './system/db.js';
import { config } from './system/config.js';

export async function startBot() {
  try {
    await loadDB();
    await loadPlugins();

    const sessionId = process.env.SESSION_ID;
    const sessionDir = path.join(process.cwd(), 'session');

    if (!fs.existsSync(path.join(sessionDir, 'creds.json'))) {
      if (sessionId) {
        if (!parseSessionId(sessionId)) {
          logger.error("Failed to extract session from SESSION_ID. Halting.");
          return;
        }
      } else {
        logger.error("No SESSION_ID provided and no local session found.");
        return;
      }
    } else {
      // Fix existing creds.json in case it was corrupted by a bad generator
      fixExistingCreds();
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: false,
      logger,
      browser: Browsers.ubuntu('Chrome'),
      markOnlineOnConnect: true,
      syncFullHistory: false
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === 'close') {
        const reason = lastDisconnect?.error?.output?.statusCode;
        if (reason === DisconnectReason.loggedOut) {
          fs.rmSync(sessionDir, { recursive: true, force: true });
          logger.info('Logged out. Generate a new SESSION_ID you imbecile.');
        } else {
          logger.info('Reconnecting...');
          setTimeout(startBot, 3000);
        }
      } else if (connection === 'open') {
        logger.info(`${config.botName} is ONLINE and ready to insult.`);
        
        try {
          const botId = sock.user.id;
          const connectedNumber = botId.split(':')[0] + '@s.whatsapp.net';
          const displayNum = botId.split(':')[0];
          
          logger.info(`Resolved JID: ${connectedNumber} | Connected Number: +${displayNum}`);
          
          const ownerNum = config.ownerNumber ? `${config.ownerNumber.replace(/[^0-9]/g, '')}@s.whatsapp.net` : null;
          
          const uptime = process.uptime();
          const days = Math.floor(uptime / 86400);
          const hours = Math.floor((uptime % 86400) / 3600);
          const mins = Math.floor((uptime % 3600) / 60);
          const secs = Math.floor(uptime % 60);
          const mem = process.memoryUsage();
          const used = (mem.heapUsed / 1024 / 1024).toFixed(1);
          const total = (mem.heapTotal / 1024 / 1024).toFixed(1);
          const ramPercent = Math.floor((mem.heapUsed / mem.heapTotal) * 100);

          const msg = `
╔═━━━━━━━━━━━━━━━━═❒
║ SWIFTBOT v3.2.0
╚━━━━━━━━━━━━━━━━━═❒
╔═━━━━━━━━━━━━━━━━═❒
║ 𖠁 Prefix: [ ${config.prefix} ]
║ 𖠁 Owner: ${config.ownerNumber || 'Not Set'}
║ 𖠁 Mode: ${config.mode.toUpperCase()}
║ 𖠁 Platform: render
║ 𖠁 Connected: +${displayNum}
║ 𖠁 Uptime: ${days}d ${hours}h ${mins}m ${secs}s
║ 𖠁 RAM: ${ramPercent}%
║ 𖠁 Usage: ${used}MB / ${total}MB
╚━━━━━━━━━━━━━━━━━═❒

Connected Successfully ✅
Type ${config.prefix}help to start`;

          const contextInfo = {
            forwardingScore: 430,
            isForwarded: true,
            externalAdReply: {
              title: 'WhatsApp',
              body: `Contact: SwiftBot Updates`,
              mediaType: 1,
              thumbnailUrl: 'https://i.ibb.co/S7sRhPFq/IMG-20260601-WA0038.jpg',
              mediaUrl: 'https://whatsapp.com/channel/0029Vb86btmI1rci3S1NUA0G',
              sourceUrl: 'https://whatsapp.com/channel/0029Vb86btmI1rci3S1NUA0G',
              showAdAttribution: true,
              renderLargerThumbnail: false,
              verifiedBizName: 'WhatsApp'
            },
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363426850850275@newsletter',
              newsletterName: 'SWIFTBOT UPDATES',
              serverMessageId: Math.floor(Math.random() * 100000)
            }
          };

          // Send to owner if configured
          if (ownerNum) {
            await sock.sendMessage(ownerNum, { text: msg, contextInfo });
            logger.info(`Startup message sent to owner: ${ownerNum}`);
          }
          
          // Always send to self
          await sock.sendMessage(connectedNumber, { text: msg, contextInfo });
          logger.info(`Startup message sent to bot's own number: ${connectedNumber}`);
        } catch (err) {
          logger.error('Failed to send startup message:', err);
        }
      }
    });

    sock.ev.on('messages.upsert', async (m) => {
      if (m.type === 'notify') {
        for (const msg of m.messages) {
          if (msg.message) {
            await router(sock, msg);
          }
        }
      }
    });

  } catch (err) {
    logger.error('CRITICAL ERROR starting bot:', err);
    // Delete corrupted session to avoid crash loop
    const sessionDir = path.join(process.cwd(), 'session');
    if (fs.existsSync(sessionDir)) {
      logger.info('Deleting corrupted session directory...');
      fs.rmSync(sessionDir, { recursive: true, force: true });
    }
    // Try to restart after a delay
    setTimeout(() => {
      logger.info('Attempting clean restart...');
      startBot();
    }, 5000);
  }
}


