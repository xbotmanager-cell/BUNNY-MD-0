import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'listadmins',
  aliases: ['admins', 'adminlist'],
  category: 'group management',
  desc: 'List all admins in the group',
  reactEmoji: '🛡️',
  execute: async ({ sock, msg, isGroup, reply }) => {
    if (!isGroup) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The loner 👑\n├⊷ Note: This is for groups only. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    try {
      const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
      const participants = groupMetadata.participants;
      const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
      
      if (admins.length === 0) {
        return reply(`╭⊷『 ⚠️ INFO 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: No admins found. Anarchy! 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
      }

      let txt = `╭──⌈ 🛡️ ADMIN LIST ⌋\n┃ ◆ Group: ${groupMetadata.subject}\n┃ ◆ Count: ${admins.length}\n╰────────────────\n\n`;

      const mentions = [];
      let count = 1;
      for (const admin of admins) {
        txt += `│ ${count}. @${admin.id.split('@')[0]} ${admin.admin === 'superadmin' ? '👑' : '💠'}\n`;
        mentions.push(admin.id);
        count++;
      }
      txt += `╰─⊷\n\n*${config.botName} Online*`;

      await sock.sendMessage(msg.key.remoteJid, { text: txt, mentions }, { quoted: msg });
    } catch (e) {
      await reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Failed to fetch admins. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }
  }
});
