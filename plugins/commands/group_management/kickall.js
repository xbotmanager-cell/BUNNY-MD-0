import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'kickall',
  aliases: ['bootall', 'clearall'],
  category: 'group management',
  desc: 'Kick all members from the group',
  reactEmoji: '💥',
  execute: async ({ sock, msg, isGroup, reply, isOwner }) => {
    if (!isGroup) {
      const txt = `╭⊷『 ⚠️ ERROR 』
│
├⊷ To: The loner 👑
├⊷ Note: This is for groups only. 💪
└⊷ Status: ❌ Failed
╰⊷*${config.botName} Online*`;
      return reply(txt);
    }
    
    if (!isOwner) {
      const txt = `╭⊷『 ⚠️ ERROR 』
│
├⊷ To: The member 👑
├⊷ Note: Only bot owners can use this highly destructive command. 💪
└⊷ Status: ❌ Failed
╰⊷*${config.botName} Online*`;
      return reply(txt);
    }

    try {
      const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
      const participants = groupMetadata.participants;
      const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.id);
      
      const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      
      if (!admins.includes(botNumber)) {
        const txt = `╭⊷『 ⚠️ ERROR 』
│
├⊷ To: The commander 👑
├⊷ Note: I need to be an admin to kick people! 💪
└⊷ Status: ❌ Failed
╰⊷*${config.botName} Online*`;
        return reply(txt);
      }

      const membersToKick = participants.filter(p => p.id !== botNumber && p.admin !== 'superadmin').map(p => p.id);
      
      if (membersToKick.length === 0) {
        return reply(`╭⊷『 ⚠️ INFO 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: No one to kick. Group is empty. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
      }

      await reply(`╭⊷『 💥 KICK ALL 』\n│\n├⊷ To: The group 👑\n├⊷ Note: Commencing mass kick operation! 💪\n└⊷ Status: ⏳ Processing...\n╰⊷*${config.botName} Online*`);

      // Kick in batches of 5 to avoid rate limits
      for (let i = 0; i < membersToKick.length; i += 5) {
        const batch = membersToKick.slice(i, i + 5);
        await sock.groupParticipantsUpdate(msg.key.remoteJid, batch, 'remove');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const txt = `╭⊷『 💥 KICK ALL 』
│
├⊷ To: The commander 👑
├⊷ Note: Successfully kicked ${membersToKick.length} members. 💪
└⊷ Status: ✅ Success
╰⊷*${config.botName} Online*`;
      await reply(txt);
    } catch (e) {
      const txt = `╭⊷『 ⚠️ ERROR 』
│
├⊷ To: The commander 👑
├⊷ Note: Failed to kick all members. 💪
└⊷ Status: ❌ Failed
╰⊷*${config.botName} Online*`;
      await reply(txt);
    }
  }
});
