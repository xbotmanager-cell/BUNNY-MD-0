import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

registerCommand({
  name: 'kick',
  aliases: ['boot', 'ban'],
  category: 'group management',
  desc: 'Kick an annoying member from the group',
  reactEmoji: '👢',
  execute: async ({ sock, msg, isGroup, reply }) => {
    if (!isGroup) {
      const txt = `╭⊷『 ⚠️ ERROR 』
│
├⊷ To: The loner 👑
├⊷ Note: This is for groups only. Get some friends first. 💪
└⊷ Status: ❌ Failed
╰⊷*${config.botName} Online*`;
      return reply(txt);
    }

    const mentionedJidList = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentionedJidList || mentionedJidList.length === 0) {
      const txt = `╭⊷『 ⚠️ ERROR 』
│
├⊷ To: The blind one 👑
├⊷ Note: Mention someone to kick! Are you scared of them? 💪
└⊷ Status: ❌ Failed
╰⊷*${config.botName} Online*`;
      return reply(txt);
    }

    try {
      await sock.groupParticipantsUpdate(msg.key.remoteJid, mentionedJidList, "remove");
      const txt = `╭⊷『 👢 KICKED 』
│
├⊷ To: The group 👑
├⊷ Note: Boom! Kicked their miserable self out. Anyone else want the boot? 💪
└⊷ Status: ✅ Success
╰⊷*${config.botName} Online*`;
      await reply(txt);
    } catch (e) {
      const txt = `╭⊷『 ⚠️ ERROR 』
│
├⊷ To: The failure 👑
├⊷ Note: Failed to kick. Maybe I'm not an admin or maybe you just suck. 💪
└⊷ Status: ❌ Failed
╰⊷*${config.botName} Online*`;
      await reply(txt);
    }
  }
});
