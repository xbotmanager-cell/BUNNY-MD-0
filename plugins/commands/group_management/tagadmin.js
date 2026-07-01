import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'tagadmin',
  aliases: ['tagadmins'],
  category: 'group management',
  desc: 'Tag all admins with a message',
  reactEmoji: '🚨',
  execute: async ({ sock, msg, isGroup, args, reply }) => {
    if (!isGroup) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The loner 👑\n├⊷ Note: This is for groups only. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    try {
      const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
      const participants = groupMetadata.participants;
      const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.id);
      
      if (admins.length === 0) {
        return reply(`╭⊷『 ⚠️ INFO 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: No admins to tag. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
      }

      const messageText = args.length > 0 ? args.join(' ') : "Admins, you have been summoned!";

      let txt = `╭──⌈ 🚨 ADMIN CALL ⌋\n┃ ◆ Message: ${messageText}\n╰────────────────\n\n`;

      let count = 1;
      for (const admin of admins) {
        txt += `│ ${count}. @${admin.split('@')[0]}\n`;
        count++;
      }
      txt += `╰─⊷\n\n*${config.botName} Online*`;

      await sock.sendMessage(msg.key.remoteJid, { text: txt, mentions: admins }, { quoted: msg });
    } catch (e) {
      await reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Failed to tag admins. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }
  }
});
