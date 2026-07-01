import { registerCommand } from '../../../system/commandhandler.js';
import { dbData, saveDB } from '../../../system/db.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'warn',
  aliases: ['warning'],
  category: 'group management',
  desc: 'Warn a member in the group',
  reactEmoji: '⚠️',
  execute: async ({ sock, msg, isGroup, args, reply }) => {
    if (!isGroup) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The loner 👑\n├⊷ Note: This is for groups only. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    const mentionedJidList = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    let target = mentionedJidList ? mentionedJidList[0] : null;

    if (!target) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Mention someone to warn! 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';
    const groupId = msg.key.remoteJid;

    if (!dbData.warnings) dbData.warnings = {};
    if (!dbData.warnings[groupId]) dbData.warnings[groupId] = {};
    if (!dbData.warnings[groupId][target]) dbData.warnings[groupId][target] = 0;

    dbData.warnings[groupId][target] += 1;
    await saveDB();

    const count = dbData.warnings[groupId][target];
    const number = target.split('@')[0];

    const txt = `╭⊷『 ⚠️ WARNED 』
│
├⊷ To: @${number} 👑
├⊷ Reason: ${reason}
├⊷ Warnings: ${count}/3
└⊷ Status: ✅ Warned
╰⊷*${config.botName} Online*`;

    await sock.sendMessage(msg.key.remoteJid, { text: txt, mentions: [target] }, { quoted: msg });

    if (count >= 3) {
      try {
        await reply(`╭⊷『 💥 KICK ALL 』\n│\n├⊷ To: @${number} 👑\n├⊷ Note: 3 warnings reached. You are outta here! 💪\n└⊷ Status: ⏳ Processing...\n╰⊷*${config.botName} Online*`);
        await sock.groupParticipantsUpdate(msg.key.remoteJid, [target], 'remove');
        dbData.warnings[groupId][target] = 0;
        await saveDB();
      } catch (e) {
        await reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Failed to kick. Make sure I am an admin! 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
      }
    }
  }
});
