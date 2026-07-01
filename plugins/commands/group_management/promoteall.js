import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'promoteall',
  aliases: ['adminall'],
  category: 'group management',
  desc: 'Promote all members to admin',
  reactEmoji: '✨',
  execute: async ({ sock, msg, isGroup, reply, isOwner }) => {
    if (!isGroup) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The loner 👑\n├⊷ Note: This is for groups only. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    if (!isOwner) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The member 👑\n├⊷ Note: Only the owner can use this! 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    try {
      const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
      const participants = groupMetadata.participants;
      const regularMembers = participants.filter(p => p.admin !== 'admin' && p.admin !== 'superadmin').map(p => p.id);
      
      if (regularMembers.length === 0) {
        return reply(`╭⊷『 ⚠️ INFO 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Everyone is already an admin. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
      }

      await reply(`╭⊷『 ✨ PROMOTE ALL 』\n│\n├⊷ To: The group 👑\n├⊷ Note: Commencing mass promotion! 💪\n└⊷ Status: ⏳ Processing...\n╰⊷*${config.botName} Online*`);

      for (let i = 0; i < regularMembers.length; i += 5) {
        const batch = regularMembers.slice(i, i + 5);
        await sock.groupParticipantsUpdate(msg.key.remoteJid, batch, 'promote');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const txt = `╭⊷『 ✨ PROMOTE ALL 』
│
├⊷ To: The group 👑
├⊷ Note: Successfully promoted ${regularMembers.length} members to admin. Chaos awaits! 💪
└⊷ Status: ✅ Success
╰⊷*${config.botName} Online*`;
      await reply(txt);
    } catch (e) {
      await reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Failed to promote everyone. Make sure I'm an admin! 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }
  }
});
