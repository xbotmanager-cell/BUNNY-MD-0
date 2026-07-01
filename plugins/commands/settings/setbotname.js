import { registerCommand } from '../../../system/commandhandler.js';
import { updateConfig, config } from '../../../system/config.js';

registerCommand({
  name: 'setbotname',
  aliases: ['botname', 'name'],
  category: 'settings',
  desc: 'Change my glorious name',
  reactEmoji: '📛',
  execute: async ({ args, reply }) => {
    if (args.length === 0) {
      const txt = `╭⊷『 ⚠️ ERROR 』
│
├⊷ To: The empty mind 👑
├⊷ Note: Give me a name, idiot! 💪
└⊷ Status: ❌ Failed
╰⊷*${config.botName} Online*`;
      return reply(txt);
    }
    const newName = args.join(' ');
    await updateConfig('botName', newName);
    const txt = `╭⊷『 📛 NAME CHANGED 』
│
├⊷ To: The commander 👑
├⊷ Note: My name is now '${newName}'. Sounds garbage, but okay. 💪
└⊷ Status: ✅ Success
╰⊷*${newName} Online*`;
    await reply(txt);
  }
});
