import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'tagall',
  aliases: ['everyone', 'all'],
  category: 'group management',
  desc: 'Tag everyone in the group',
  reactEmoji: '📢',
  execute: async ({ sock, msg, isGroup, reply, replyWithImage }) => {
    if (!isGroup) {
      const txt = `╭⊷『 ⚠️ ERROR 』
│
├⊷ To: The loner 👑
├⊷ Note: This is for groups only. 💪
└⊷ Status: ❌ Failed
╰⊷*${config.botName} Online*`;
      return reply(txt);
    }

    try {
      const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
      const participants = groupMetadata.participants;
      const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
      const creator = groupMetadata.owner || participants.find(p => p.admin === 'superadmin')?.id || admins[0]?.id;
      const members = participants.filter(p => p.admin !== 'admin' && p.admin !== 'superadmin' && p.id !== creator);

      let tagMsg = `╭──⌈ 📢 TAG ALL ⌋\n┃ ◆ Group: ${groupMetadata.subject}\n┃ ◆ Members: ${participants.length}\n╰────────────────\n\n`;

      let count = 1;
      const mentions = [];

      // Add Creator
      if (creator) {
        tagMsg += `╭─⊷ *👑 CREATOR*\n`;
        tagMsg += `│ ${count}. @${creator.split('@')[0]} ⚜️\n╰─⊷\n\n`;
        mentions.push(creator);
        count++;
      }

      // Add Admins
      if (admins.length > 0) {
        tagMsg += `╭─⊷ *🛡️ ADMINS*\n`;
        for (const admin of admins) {
          if (admin.id === creator) continue;
          tagMsg += `│ ${count}. @${admin.id.split('@')[0]} 💠\n`;
          mentions.push(admin.id);
          count++;
        }
        tagMsg += `╰─⊷\n\n`;
      }

      // Add Members
      if (members.length > 0) {
        tagMsg += `╭─⊷ *👥 MEMBERS*\n`;
        for (const member of members) {
          tagMsg += `│ ${count}. @${member.id.split('@')[0]} 👤\n`;
          mentions.push(member.id);
          count++;
        }
        tagMsg += `╰─⊷\n\n*${config.botName} Online*`;
      }

      let gpp;
      try {
        gpp = await sock.profilePictureUrl(msg.key.remoteJid, 'image');
      } catch {
        gpp = config.botImage;
      }

      await sock.sendMessage(msg.key.remoteJid, { image: { url: gpp }, caption: tagMsg, mentions }, { quoted: msg });
    } catch (e) {
      const txt = `╭⊷『 ⚠️ ERROR 』
│
├⊷ To: The commander 👑
├⊷ Note: Failed to fetch group data. 💪
└⊷ Status: ❌ Failed
╰⊷*${config.botName} Online*`;
      await reply(txt);
    }
  }
});
