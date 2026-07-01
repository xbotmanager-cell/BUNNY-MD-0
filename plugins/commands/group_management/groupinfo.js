import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'groupinfo',
  aliases: ['infogroup', 'ginfo'],
  category: 'group management',
  desc: 'Get information about the group',
  reactEmoji: 'ℹ️',
  execute: async ({ sock, msg, isGroup, reply, replyWithImage }) => {
    if (!isGroup) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The loner 👑\n├⊷ Note: This is for groups only. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    try {
      const metadata = await sock.groupMetadata(msg.key.remoteJid);
      const members = metadata.participants.length;
      const admins = metadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').length;
      const creator = metadata.owner ? metadata.owner.split('@')[0] : 'Unknown';
      const creationDate = metadata.creation ? new Date(metadata.creation * 1000).toLocaleString() : 'Unknown';

      const txt = `╭──⌈ ℹ️ GROUP INFO ⌋
┃ ◆ Name: ${metadata.subject}
┃ ◆ ID: ${metadata.id}
┃ ◆ Creator: @${creator}
┃ ◆ Created On: ${creationDate}
┃ ◆ Members: ${members}
┃ ◆ Admins: ${admins}
┃ ◆ Description: ${metadata.desc ? metadata.desc.toString() : 'None'}
╰────────────────\n\n*${config.botName} Online*`;

      let gpp;
      try {
        gpp = await sock.profilePictureUrl(msg.key.remoteJid, 'image');
        await sock.sendMessage(msg.key.remoteJid, { image: { url: gpp }, caption: txt, mentions: [metadata.owner] }, { quoted: msg });
      } catch {
        await sock.sendMessage(msg.key.remoteJid, { text: txt, mentions: [metadata.owner] }, { quoted: msg });
      }
    } catch (e) {
      await reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Failed to fetch group info. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }
  }
});
