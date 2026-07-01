import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'grouplink',
  aliases: ['linkgroup', 'invite'],
  category: 'group management',
  desc: 'Get the invite link for the group',
  reactEmoji: '🔗',
  execute: async ({ sock, msg, isGroup, reply }) => {
    if (!isGroup) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The loner 👑\n├⊷ Note: This is for groups only. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    try {
      const code = await sock.groupInviteCode(msg.key.remoteJid);
      
      const txt = `╭⊷『 🔗 GROUP LINK 』
│
├⊷ To: The group 👑
├⊷ Link: https://chat.whatsapp.com/${code}
└⊷ Status: ✅ Success
╰⊷*${config.botName} Online*`;
      await reply(txt);
    } catch (e) {
      await reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Failed to fetch group link. Am I an admin? 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }
  }
});
