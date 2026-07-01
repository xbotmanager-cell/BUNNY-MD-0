import { registerCommand } from '../../../system/commandhandler.js';
import { dbData, saveDB } from '../../../system/db.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'resetwarn',
  aliases: ['clearwarn', 'unwarn'],
  category: 'group management',
  desc: 'Reset a member\'s warnings',
  reactEmoji: '🔄',
  execute: async ({ sock, msg, isGroup, args, reply }) => {
    if (!isGroup) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The loner 👑\n├⊷ Note: This is for groups only. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    const mentionedJidList = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    let target = mentionedJidList ? mentionedJidList[0] : null;

    if (!target) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Mention someone to reset their warnings! 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    const groupId = msg.key.remoteJid;

    if (!dbData.warnings || !dbData.warnings[groupId] || !dbData.warnings[groupId][target]) {
      return reply(`╭⊷『 ⚠️ INFO 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: This user has no warnings. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    dbData.warnings[groupId][target] = 0;
    await saveDB();

    const number = target.split('@')[0];

    const txt = `╭⊷『 🔄 WARNINGS RESET 』
│
├⊷ To: @${number} 👑
├⊷ Note: Your warnings have been cleared. Behave! 💪
└⊷ Status: ✅ Success
╰⊷*${config.botName} Online*`;

    await sock.sendMessage(msg.key.remoteJid, { text: txt, mentions: [target] }, { quoted: msg });
  }
});
