import { registerCommand, getCommands } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';
import os from 'os';

function formatUptime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  let time = '';
  if (d > 0) time += `${d}d `;
  if (h > 0) time += `${h}h `;
  if (m > 0) time += `${m}m `;
  time += `${s}s`;
  return time;
}

registerCommand({
  name: 'help',
  aliases: ['h', 'menu'],
  category: 'general',
  desc: 'Show all available commands so you can stop whining',
  reactEmoji: '📜',
  execute: async ({ replyWithImage, sender }) => {
    const cmds = Array.from(getCommands().values());
    const uniqueCmds = [...new Set(cmds)];
    
    const totalMem = Math.round(os.totalmem() / 1024 / 1024);
    const usedMem = Math.round(process.memoryUsage().rss / 1024 / 1024);
    const ramPercent = Math.round((usedMem / totalMem) * 100);
    const uptime = formatUptime(process.uptime());
    const senderName = sender ? sender.split('@')[0] : 'User';

    let menu = `╭──⌈ 🤖 ${config.botName.toUpperCase()} ⌋
┃ ◆ User: ▣ @${senderName} 👑
┃ ◆ Mode: 🌍 ${config.mode.charAt(0).toUpperCase() + config.mode.slice(1)}
┃ ◆ Prefix: [ ${config.prefix} ]
┃ ◆ Status: Active
┃ ◆ Uptime: ${uptime}
┃ ◆ RAM: ${ramPercent}%
┃ ◆ Memory: ${usedMem}MB / ${totalMem}MB
╰────────────────\n`;

    const categories = [...new Set(uniqueCmds.map(c => c.category))];
    
    for (const cat of categories) {
      const catCmds = uniqueCmds.filter(c => c.category === cat);
      if (catCmds.length > 0) {
        menu += `╭─⊷ *⚙️ ${cat.toUpperCase()}*\n│\n`;
        for (const c of catCmds) {
          menu += `│  • ${c.name}\n`;
        }
        menu += `╰─⊷\n\n`;
      }
    }

    menu += `└⊷ Status: ✅ Stable\n╰⊷*${config.botName} Online*`;
    
    await replyWithImage(menu, config.botImage);
  }
});
