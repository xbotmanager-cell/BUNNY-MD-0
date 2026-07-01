import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'rejectall',
  aliases: ['denyall', 'refuseall'],
  category: 'group management',
  desc: 'Reject all pending join requests',
  reactEmoji: '❌',
  execute: async ({ sock, msg, isGroup, reply, isOwner }) => {
    if (!isGroup) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The loner 👑\n├⊷ Note: This is for groups only. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    try {
      const pending = await sock.groupRequestParticipantsList(msg.key.remoteJid);
      
      if (!pending || pending.length === 0) {
        return reply(`╭⊷『 ⚠️ INFO 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: No pending join requests! 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
      }

      await reply(`╭⊷『 ❌ REJECT ALL 』\n│\n├⊷ To: The group 👑\n├⊷ Note: Rejecting ${pending.length} members. 💪\n└⊷ Status: ⏳ Processing...\n╰⊷*${config.botName} Online*`);

      for (const p of pending) {
        await sock.groupRequestParticipantsUpdate(msg.key.remoteJid, [p.jid], 'reject');
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const txt = `╭⊷『 ❌ REJECT ALL 』
│
├⊷ To: The commander 👑
├⊷ Note: Successfully rejected ${pending.length} members. Too bad for them! 💪
└⊷ Status: ✅ Success
╰⊷*${config.botName} Online*`;
      await reply(txt);
    } catch (e) {
      await reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Failed to reject members. Make sure I'm an admin. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }
  }
});
