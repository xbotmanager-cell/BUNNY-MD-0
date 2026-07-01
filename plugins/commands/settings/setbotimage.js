import { registerCommand } from '../../../system/commandhandler.js';
import { updateConfig, config } from '../../../system/config.js';

registerCommand({
  name: 'setbotimage',
  aliases: ['botimage', 'image'],
  category: 'settings',
  desc: 'Change my profile image link',
  reactEmoji: '🖼️',
  execute: async ({ args, reply }) => {
    if (args.length === 0) {
      const txt = `╭⊷『 ⚠️ ERROR 』
│
├⊷ To: The blind one 👑
├⊷ Note: Give me a URL, idiot! 💪
└⊷ Status: ❌ Failed
╰⊷*${config.botName} Online*`;
      return reply(txt);
    }
    const newUrl = args[0];
    await updateConfig('botImage', newUrl);
    const txt = `╭⊷『 🖼️ IMAGE CHANGED 』
│
├⊷ To: The commander 👑
├⊷ Note: My image is updated. I hope it's not ugly. 💪
└⊷ Status: ✅ Success
╰⊷*${config.botName} Online*`;
    await reply(txt);
  }
});
