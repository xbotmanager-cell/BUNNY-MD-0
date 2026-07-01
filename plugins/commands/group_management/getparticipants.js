import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'getparticipants',
  aliases: ['members', 'listmembers'],
  category: 'group management',
  desc: 'List all members in the group',
  reactEmoji: '👥',
  execute: async ({ sock, msg, isGroup, reply }) => {
    if (!isGroup) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The loner 👑\n├⊷ Note: This is for groups only. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    try {
      const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
      const participants = groupMetadata.participants;

      let txt = `╭──⌈ 👥 MEMBER LIST ⌋\n┃ ◆ Group: ${groupMetadata.subject}\n┃ ◆ Count: ${participants.length}\n╰────────────────\n\n`;

      let count = 1;
      const mentions = [];
      for (const p of participants) {
        let role = '👤';
        if (p.admin === 'superadmin') role = '👑';
        else if (p.admin === 'admin') role = '💠';
        
        txt += `│ ${count}. @${p.id.split('@')[0]} ${role}\n`;
        mentions.push(p.id);
        count++;
      }
      txt += `╰─⊷\n\n*${config.botName} Online*`;

      await sock.sendMessage(msg.key.remoteJid, { text: txt, mentions }, { quoted: msg });
    } catch (e) {
      await reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Failed to fetch participants. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }
  }
});
