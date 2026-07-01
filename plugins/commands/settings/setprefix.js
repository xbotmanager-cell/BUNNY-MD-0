import { registerCommand } from '../../../system/commandhandler.js';
import { updateConfig, config } from '../../../system/config.js';

registerCommand({
  name: 'setprefix',
  aliases: ['prefix'],
  category: 'settings',
  desc: 'Change my command prefix',
  reactEmoji: '🔣',
  execute: async ({ args, reply }) => {
    if (args.length === 0) {
      const txt = `╭⊷『 ⚠️ ERROR 』
│
├⊷ To: The blind one 👑
├⊷ Note: Give me a prefix, idiot! 💪
└⊷ Status: ❌ Failed
╰⊷*${config.botName} Online*`;
      return reply(txt);
    }
    const newPrefix = args[0];
    await updateConfig('prefix', newPrefix);
    const txt = `╭⊷『 🔣 PREFIX CHANGED 』
│
├⊷ To: The commander 👑
├⊷ Note: My prefix is now '${newPrefix}'. Don't forget it, goldfish brain. 💪
└⊷ Status: ✅ Success
╰⊷*${config.botName} Online*`;
    await reply(txt);
  }
});
