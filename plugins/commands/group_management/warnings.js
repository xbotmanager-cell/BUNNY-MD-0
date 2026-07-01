import { registerCommand } from '../../../system/commandhandler.js';
import { dbData } from '../../../system/db.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'warnings',
  aliases: ['warnlist', 'mywarns'],
  category: 'group management',
  desc: 'Check warnings of a member',
  reactEmoji: '📋',
  execute: async ({ sock, msg, isGroup, reply }) => {
    if (!isGroup) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The loner 👑\n├⊷ Note: This is for groups only. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    const mentionedJidList = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    let target = mentionedJidList ? mentionedJidList[0] : (msg.key.participant || msg.key.remoteJid);

    const groupId = msg.key.remoteJid;

    if (!dbData.warnings || !dbData.warnings[groupId] || !dbData.warnings[groupId][target]) {
      return reply(`╭⊷『 ⚠️ INFO 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: This user has 0 warnings. Good boy! 💪\n└⊷ Status: ✅ Success\n╰⊷*${config.botName} Online*`);
    }

    const count = dbData.warnings[groupId][target];
    const number = target.split('@')[0];

    const txt = `╭⊷『 📋 WARNINGS 』
│
├⊷ To: @${number} 👑
├⊷ Warnings: ${count}/3
└⊷ Status: ⚠️ Watch out!
╰⊷*${config.botName} Online*`;

    await sock.sendMessage(msg.key.remoteJid, { text: txt, mentions: [target] }, { quoted: msg });
  }
});
