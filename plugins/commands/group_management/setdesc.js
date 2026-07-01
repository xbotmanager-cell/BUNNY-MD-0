import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'setdesc',
  aliases: ['groupdesc', 'changedesc'],
  category: 'group management',
  desc: 'Change the group description',
  reactEmoji: '📝',
  execute: async ({ sock, msg, isGroup, args, reply }) => {
    if (!isGroup) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The loner 👑\n├⊷ Note: This is for groups only. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    const desc = args.join(' ');
    
    if (!desc) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Provide a description text! 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    try {
      await sock.groupUpdateDescription(msg.key.remoteJid, desc);
      
      const txt = `╭⊷『 📝 DESC UPDATED 』
│
├⊷ To: The group 👑
├⊷ Note: Group description has been changed. 💪
└⊷ Status: ✅ Success
╰⊷*${config.botName} Online*`;
      await reply(txt);
    } catch (e) {
      await reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Failed to update description. Make sure I'm an admin. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }
  }
});
