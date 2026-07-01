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
import { parseSessionId } from './system/sessionParser.js';
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

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        fs.rmSync(sessionDir, { recursive: true, force: true });
        logger.info('Logged out. Generate a new SESSION_ID you imbecile.');
      } else {
        logger.info('Reconnecting...');
        startBot();
      }
    } else if (connection === 'open') {
      logger.info(`${config.botName} is ONLINE and ready to insult.`);
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


