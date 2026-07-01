import { registerCommand } from '../../../system/commandhandler.js';
import { updateConfig, config } from '../../../system/config.js';

registerCommand({
  name: 'cmdreact',
  aliases: ['reaction'],
  category: 'settings',
  desc: 'Enable or disable command reactions',
  reactEmoji: '🔄',
  execute: async ({ args, reply }) => {
    if (args.length === 0 || !['on', 'off'].includes(args[0].toLowerCase())) {
      const txt = `╭⊷『 ⚠️ ERROR 』
│
├⊷ To: The confused one 👑
├⊷ Note: Use 'on' or 'off', you fool! 💪
└⊷ Status: ❌ Failed
╰⊷*${config.botName} Online*`;
      return reply(txt);
    }
    const turnOn = args[0].toLowerCase() === 'on';
    await updateConfig('cmdReact', turnOn);
    
    const txt = `╭⊷『 🔄 REACTIONS UPDATED 』
│
├⊷ To: The commander 👑
├⊷ Note: Command reactions are now ${turnOn ? 'ON' : 'OFF'}. Happy now? 💪
└⊷ Status: ✅ Success
╰⊷*${config.botName} Online*`;
    await reply(txt);
  }
});
