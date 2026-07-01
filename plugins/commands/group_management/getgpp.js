import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'getgpp',
  aliases: ['getgrouppic', 'grouppic'],
  category: 'group management',
  desc: 'Get the group profile picture',
  reactEmoji: '🖼️',
  execute: async ({ sock, msg, isGroup, reply }) => {
    if (!isGroup) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The loner 👑\n├⊷ Note: This is for groups only. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    try {
      let gpp;
      try {
        gpp = await sock.profilePictureUrl(msg.key.remoteJid, 'image');
      } catch {
        return reply(`╭⊷『 ⚠️ INFO 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Group doesn't have a profile picture. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
      }

      const txt = `╭⊷『 🖼️ GROUP PICTURE 』
│
├⊷ To: The group 👑
├⊷ Note: Here is your shiny group picture! 💪
└⊷ Status: ✅ Success
╰⊷*${config.botName} Online*`;

      await sock.sendMessage(msg.key.remoteJid, { image: { url: gpp }, caption: txt }, { quoted: msg });
    } catch (e) {
      await reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Failed to fetch group picture. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }
  }
});
