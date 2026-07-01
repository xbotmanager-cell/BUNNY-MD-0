import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'ping',
  aliases: ['p', 'pong'],
  category: 'general',
  desc: 'Check if this pathetic bot is alive',
  reactEmoji: '🏓',
  execute: async ({ msg, reply }) => {
    const timestamp = msg.messageTimestamp ? (msg.messageTimestamp * 1000) : Date.now();
    const speed = Date.now() - timestamp;
    
    const text = `╭⊷『 🏓 PONG 』
│
├⊷ To: The impatient one 👑
├⊷ Wish: Here is your data! 🌅
├⊷ Note: Processing faster than your brain 💪
├⊷ Speed: ${speed}ms ⚡
└⊷ Connection: ✅ Stable
╰⊷*${config.botName} Online*`;

    await reply(text);
  }
});
