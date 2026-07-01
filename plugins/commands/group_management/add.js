import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'add',
  aliases: ['invite'],
  category: 'group management',
  desc: 'Add a user to the group',
  reactEmoji: '➕',
  execute: async ({ sock, msg, isGroup, args, reply }) => {
    if (!isGroup) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The loner 👑\n├⊷ Note: This is for groups only. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    const number = args[0] ? args[0].replace(/[^0-9]/g, '') : null;
    
    if (!number) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Provide a number to add! 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    try {
      const userJid = `${number}@s.whatsapp.net`;
      await sock.groupParticipantsUpdate(msg.key.remoteJid, [userJid], 'add');
      
      const txt = `╭⊷『 ➕ MEMBER ADDED 』
│
├⊷ To: The group 👑
├⊷ Note: Successfully added @${number} to the group. 💪
└⊷ Status: ✅ Success
╰⊷*${config.botName} Online*`;
      await sock.sendMessage(msg.key.remoteJid, { text: txt, mentions: [userJid] }, { quoted: msg });
    } catch (e) {
      await reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Failed to add member. Maybe their privacy settings block it or I'm not an admin. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }
  }
});
