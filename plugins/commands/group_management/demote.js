import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'demote',
  aliases: ['unadmin'],
  category: 'group management',
  desc: 'Demote an admin to a regular member',
  reactEmoji: '🔽',
  execute: async ({ sock, msg, isGroup, reply }) => {
    if (!isGroup) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The loner 👑\n├⊷ Note: This is for groups only. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    const mentionedJidList = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    let target = mentionedJidList ? mentionedJidList[0] : null;

    if (!target) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Mention someone to demote! 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    try {
      await sock.groupParticipantsUpdate(msg.key.remoteJid, [target], 'demote');
      
      const number = target.split('@')[0];
      const txt = `╭⊷『 🔽 DEMOTED 』
│
├⊷ To: @${number} 👑
├⊷ Note: You are no longer an admin. Back to the bottom you go! 💪
└⊷ Status: ✅ Success
╰⊷*${config.botName} Online*`;
      await sock.sendMessage(msg.key.remoteJid, { text: txt, mentions: [target] }, { quoted: msg });
    } catch (e) {
      await reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Failed to demote. Make sure I am an admin! 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }
  }
});
