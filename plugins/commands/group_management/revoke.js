import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'revoke',
  aliases: ['resetlink', 'revokelink'],
  category: 'group management',
  desc: 'Revoke and generate a new group invite link',
  reactEmoji: '🔄',
  execute: async ({ sock, msg, isGroup, reply }) => {
    if (!isGroup) {
      return reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The loner 👑\n├⊷ Note: This is for groups only. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }

    try {
      await sock.groupRevokeInvite(msg.key.remoteJid);
      const newCode = await sock.groupInviteCode(msg.key.remoteJid);
      
      const txt = `╭⊷『 🔄 LINK REVOKED 』
│
├⊷ To: The group 👑
├⊷ Note: The old link has been destroyed.
├⊷ New Link: https://chat.whatsapp.com/${newCode}
└⊷ Status: ✅ Success
╰⊷*${config.botName} Online*`;
      await reply(txt);
    } catch (e) {
      await reply(`╭⊷『 ⚠️ ERROR 』\n│\n├⊷ To: The commander 👑\n├⊷ Note: Failed to revoke link. Make sure I'm an admin. 💪\n└⊷ Status: ❌ Failed\n╰⊷*${config.botName} Online*`);
    }
  }
});
