import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'demoteall',
  aliases: ['unadminall'],
  category: 'group management',
  desc: 'Demote all admins to regular members',
  reactEmoji: '📉',
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
      const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      const creator = groupMetadata.owner || participants.find(p => p.admin === 'superadmin')?.id;

      const adminsToDemote = participants
        .filter(p => p.admin === 'admin' && p.id !== botNumber && p.id !== creator)
        .map(p => p.id);
      
      if (adminsToDemote.length === 0) {
        return reply(`╭⊷『 ⚠️ INFO 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: No admins to demote. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
      }

      await reply(`╭⊷『 📉 DEMOTE ALL 』\n│\n├⊷ To: The group 👑\n├⊷ Note: Commencing mass demotion! Bringing everyone back down to earth! 💪\n└⊷ Status: ⏳ Processing...\n╰⊷*${config.botName} Online*`);

      for (let i = 0; i < adminsToDemote.length; i += 5) {
        const batch = adminsToDemote.slice(i, i + 5);
        await sock.groupParticipantsUpdate(msg.key.remoteJid, batch, 'demote');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const txt = `╭⊷『 📉 DEMOTE ALL 』
│
├⊷ To: The group 👑
├⊷ Note: Successfully demoted ${adminsToDemote.length} admins. Power trip is over! 💪
└⊷ Status: ✅ Success
╰⊷*${config.botName} Online*`;
      await reply(txt);
    } catch (e) {
      await reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Failed to demote everyone. Make sure I'm an admin! 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }
  }
});
