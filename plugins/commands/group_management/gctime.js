import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'gctime',
  aliases: ['grouptime', 'opentime', 'closetime'],
  category: 'group management',
  desc: 'Open or close the group temporarily',
  reactEmoji: '⏱️',
  execute: async ({ sock, msg, isGroup, args, reply }) => {
    if (!isGroup) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The loner 👑\n├⊷ Note: This is for groups only. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    if (args.length === 0 || !['open', 'close'].includes(args[0].toLowerCase())) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Use 'open' or 'close'! 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    const action = args[0].toLowerCase() === 'open' ? 'not_announcement' : 'announcement';
    const statusText = args[0].toLowerCase() === 'open' ? 'OPENED' : 'CLOSED';

    try {
      await sock.groupSettingUpdate(msg.key.remoteJid, action);
      
      const txt = `╭⊷『 ⏱️ GROUP ${statusText} 』
│
├⊷ To: The group 👑
├⊷ Note: The group is now ${statusText.toLowerCase()}. 💪
└⊷ Status: ✅ Success
╰⊷*${config.botName} Online*`;
      await reply(txt);
    } catch (e) {
      await reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Failed to update group time. Am I an admin? 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }
  }
});
