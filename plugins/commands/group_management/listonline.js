import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'listonline',
  aliases: ['online', 'active'],
  category: 'group management',
  desc: 'List online members (if presence is shared)',
  reactEmoji: '🟢',
  execute: async ({ sock, msg, isGroup, reply }) => {
    if (!isGroup) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The loner 👑\n├⊷ Note: This is for groups only. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    try {
      const presences = sock.presences[msg.key.remoteJid] || {};
      const onlineMembers = Object.keys(presences).filter(
        (jid) => presences[jid]?.lastKnownPresence === 'available' || presences[jid]?.lastKnownPresence === 'composing'
      );

      if (onlineMembers.length === 0) {
        return reply(`╭⊷『 ⚠️ INFO 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: No one is online (or their privacy is hiding it). 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
      }

      let txt = `╭──⌈ 🟢 ONLINE MEMBERS ⌋\n┃ ◆ Count: ${onlineMembers.length}\n╰────────────────\n\n`;

      let count = 1;
      for (const member of onlineMembers) {
        txt += `│ ${count}. @${member.split('@')[0]}\n`;
        count++;
      }
      txt += `╰─⊷\n\n*${config.botName} Online*`;

      await sock.sendMessage(msg.key.remoteJid, { text: txt, mentions: onlineMembers }, { quoted: msg });
    } catch (e) {
      await reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Failed to fetch online members. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }
  }
});
