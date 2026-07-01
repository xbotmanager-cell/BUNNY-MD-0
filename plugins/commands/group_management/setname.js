import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'setname',
  aliases: ['groupname', 'changename'],
  category: 'group management',
  desc: 'Change the group name',
  reactEmoji: '🏷️',
  execute: async ({ sock, msg, isGroup, args, reply }) => {
    if (!isGroup) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The loner 👑\n├⊷ Note: This is for groups only. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    const name = args.join(' ');
    
    if (!name) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Provide a name text! 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    try {
      await sock.groupUpdateSubject(msg.key.remoteJid, name);
      
      const txt = `╭⊷『 🏷️ NAME UPDATED 』
│
├⊷ To: The group 👑
├⊷ Note: Group name has been changed to '${name}'. 💪
└⊷ Status: ✅ Success
╰⊷*${config.botName} Online*`;
      await reply(txt);
    } catch (e) {
      await reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Failed to update name. Make sure I'm an admin. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }
  }
});
