import { registerCommand } from '../../../system/commandhandler.js';
import { updateConfig, config } from '../../../system/config.js';

registerCommand({
  name: 'setowner',
  aliases: ['owner'],
  category: 'settings',
  desc: 'Set the bot owner number',
  reactEmoji: '👑',
  execute: async ({ args, reply, isOwner, msg }) => {
    if (!isOwner && config.ownerNumber) {
      const txt = `╭⊷『 ⚠️ ERROR 』
│
├⊷ To: The imposter 👑
├⊷ Note: Only the current owner can change the owner! 💪
└⊷ Status: ❌ Failed
╰⊷*${config.botName} Online*`;
      return reply(txt);
    }

    let newOwner = "";
    const mentionedJidList = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (mentionedJidList && mentionedJidList.length > 0) {
      newOwner = mentionedJidList[0].split('@')[0];
    } else if (args.length > 0) {
      newOwner = args[0].replace(/[^0-9]/g, '');
    }

    if (!newOwner) {
      const txt = `╭⊷『 ⚠️ ERROR 』
│
├⊷ To: The commander 👑
├⊷ Note: Provide a number or tag someone! 💪
└⊷ Status: ❌ Failed
╰⊷*${config.botName} Online*`;
      return reply(txt);
    }

    await updateConfig('ownerNumber', newOwner);
    
    const txt = `╭⊷『 👑 OWNER SET 』
│
├⊷ To: The new owner 👑
├⊷ Note: The owner is now set to ${newOwner}. 💪
└⊷ Status: ✅ Success
╰⊷*${config.botName} Online*`;
    await reply(txt);
  }
});
