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
        
        const textMessage = `*${config.botName} IS ONLINE!* 🚀\n\n` + 
          `*Connected Number:* +${displayNum}\n` + 
          `*Mode:* ${config.mode}\n` +
          `*Prefix:* ${config.prefix}\n\n` + 
          `_Bot is now fully operational with 10+ ways to connect enabled!_ ✅`;
          
        // Send to owner if configured
        if (ownerNum) {
          await sock.sendMessage(ownerNum, { text: textMessage });
          logger.info(`Startup message sent to owner: ${ownerNum}`);
        }
        
        // Always send to self
        await sock.sendMessage(connectedNumber, { text: textMessage });
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
}


