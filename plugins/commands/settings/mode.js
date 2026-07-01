import { registerCommand } from '../../../system/commandhandler.js';
import { updateConfig, config } from '../../../system/config.js';

registerCommand({
  name: 'mode',
  aliases: ['setmode'],
  category: 'settings',
  desc: 'Change bot mode (public, private, groups, dm, maintenance)',
  reactEmoji: '⚙️',
  execute: async ({ args, reply, isOwner }) => {
    if (!isOwner) {
      const txt = `╭⊷『 ⚠️ ERROR 』
│
├⊷ To: The imposter 👑
├⊷ Note: Only the owner can change the mode! 💪
└⊷ Status: ❌ Failed
╰⊷*${config.botName} Online*`;
      return reply(txt);
    }

    const validModes = ['public', 'private', 'groups', 'dm', 'maintenance'];
    const newMode = args[0]?.toLowerCase();

    if (!newMode || !validModes.includes(newMode)) {
      const txt = `╭⊷『 ⚠️ ERROR 』
│
├⊷ To: The commander 👑
├⊷ Note: Invalid mode. Use: ${validModes.join(', ')} 💪
└⊷ Status: ❌ Failed
╰⊷*${config.botName} Online*`;
      return reply(txt);
    }

    await updateConfig('mode', newMode);
    
    const txt = `╭⊷『 ⚙️ MODE CHANGED 』
│
├⊷ To: The commander 👑
├⊷ Note: Bot mode is now set to '${newMode}'. 💪
└⊷ Status: ✅ Success
╰⊷*${config.botName} Online*`;
    await reply(txt);
  }
});
