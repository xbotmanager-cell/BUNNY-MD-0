import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'leave',
  aliases: ['left', 'quit'],
  category: 'group management',
  desc: 'Make the bot leave the group',
  reactEmoji: '👋',
  execute: async ({ sock, msg, isGroup, reply, isOwner }) => {
    if (!isGroup) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The loner 👑\n├⊷ Note: This is for groups only. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    if (!isOwner) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The member 👑\n├⊷ Note: Only my owner can tell me to leave. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    try {
      await reply(`╭⊷『 👋 FAREWELL 』\n│\n├⊷ To: Everyone 👑\n├⊷ Note: I'm outta here. Peace! ✌️\n└⊷ Status: ✅ Success\n╰⊷*${config.botName} Online*`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      await sock.groupLeave(msg.key.remoteJid);
    } catch (e) {
      await reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Failed to leave. I'm stuck here with you. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }
  }
});
