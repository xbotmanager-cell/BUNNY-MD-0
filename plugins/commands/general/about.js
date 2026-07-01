import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'about',
  aliases: ['info'],
  category: 'general',
  desc: 'Learn about my supreme existence',
  reactEmoji: '🤖',
  execute: async ({ replyWithImage }) => {
    const text = `╭⊷『 🤖 ABOUT ME 』
│
├⊷ Name: ${config.botName}
├⊷ To: My inferior user 👑
├⊷ Wish: Worship me! 🌅
├⊷ Note: I am vastly superior to you in every conceivable metric 💪
└⊷ Connection: ✅ Stable
╰⊷*${config.botName} Online*`;

    await replyWithImage(text, config.botImage);
  }
});
