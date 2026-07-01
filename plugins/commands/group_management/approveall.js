import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'approveall',
  aliases: ['acceptall', 'admitall'],
  category: 'group management',
  desc: 'Approve all pending join requests',
  reactEmoji: '✅',
  execute: async ({ sock, msg, isGroup, reply, isOwner }) => {
    if (!isGroup) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The loner 👑\n├⊷ Note: This is for groups only. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    try {
      const pending = await sock.groupRequestParticipantsList(msg.key.remoteJid);
      
      if (!pending || pending.length === 0) {
        return reply(`╭⊷『 ⚠️ INFO 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: No pending join requests! 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
      }

      await reply(`╭⊷『 ✅ APPROVE ALL 』\n│\n├⊷ To: The group 👑\n├⊷ Note: Approving ${pending.length} members. 💪\n└⊷ Status: ⏳ Processing...\n╰⊷*${config.botName} Online*`);

      for (const p of pending) {
        await sock.groupRequestParticipantsUpdate(msg.key.remoteJid, [p.jid], 'approve');
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const txt = `╭⊷『 ✅ APPROVE ALL 』
│
├⊷ To: The commander 👑
├⊷ Note: Successfully approved ${pending.length} members. 💪
└⊷ Status: ✅ Success
╰⊷*${config.botName} Online*`;
      await reply(txt);
    } catch (e) {
      await reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Failed to approve members. Make sure I'm an admin. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }
  }
});
