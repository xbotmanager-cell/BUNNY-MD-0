import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'getdesc',
  aliases: ['descgroup', 'groupdesc'],
  category: 'group management',
  desc: 'Get the group description',
  reactEmoji: '📝',
  execute: async ({ sock, msg, isGroup, reply }) => {
    if (!isGroup) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The loner 👑\n├⊷ Note: This is for groups only. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    try {
      const metadata = await sock.groupMetadata(msg.key.remoteJid);
      const desc = metadata.desc ? metadata.desc.toString() : 'No description set for this group.';

      const txt = `╭──⌈ 📝 GROUP DESCRIPTION ⌋
┃
┃ ${desc}
┃
╰────────────────\n\n*${config.botName} Online*`;

      await reply(txt);
    } catch (e) {
      await reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Failed to fetch group description. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }
  }
});
