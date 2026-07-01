import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'hidetag',
  aliases: ['ht', 'announce'],
  category: 'group management',
  desc: 'Tag everyone silently',
  reactEmoji: '🔔',
  execute: async ({ sock, msg, isGroup, args, reply }) => {
    if (!isGroup) {
      const txt = `╭⊷『 ⚠️ ERROR 』
│
├⊷ To: The loner 👑
├⊷ Note: This is for groups only. 💪
└⊷ Status: ❌ Failed
╰⊷*${config.botName} Online*`;
      return reply(txt);
    }

    try {
      const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
      const participants = groupMetadata.participants;
      const mentions = participants.map(p => p.id);
      
      const messageText = args.length > 0 ? args.join(' ') : "Announcement!";

      await sock.sendMessage(msg.key.remoteJid, { text: messageText, mentions });
    } catch (e) {
      const txt = `╭⊷『 ⚠️ ERROR 』
│
├⊷ To: The commander 👑
├⊷ Note: Failed to send hidetag. 💪
└⊷ Status: ❌ Failed
╰⊷*${config.botName} Online*`;
      await reply(txt);
    }
  }
});
