import { registerCommand } from '../../../system/commandhandler.js';
import { config } from '../../../system/config.js';

const roasts = [
  "You're proof that evolution can go in reverse.",
  "I'd agree with you but then we'd both be wrong.",
  "You bring everyone so much joy when you leave the room.",
  "I was going to give you a nasty look, but you already have one.",
  "Some day you'll go far... and I hope you stay there.",
  "You're like a cloud. When you disappear, it's a beautiful day.",
  "I'm not saying I hate you, but I would unplug your life support to charge my phone."
];

registerCommand({
  name: 'roast',
  aliases: ['insult'],
  category: 'games',
  desc: 'Roast someone to a crisp',
  reactEmoji: '🔥',
  execute: async ({ msg, args, reply }) => {
    let target = "You";
    const mentionedJidList = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;

    if (mentionedJidList && mentionedJidList.length > 0) {
      target = `@${mentionedJidList[0].split('@')[0]}`;
    } else if (args.length > 0) {
      target = args.join(' ');
    }

    const roast = roasts[Math.floor(Math.random() * roasts.length)];
    const txt = `╭⊷『 🔥 ROASTED 』
│
├⊷ To: ${target} 👑
├⊷ Note: ${roast} 💪
└⊷ Status: ✅ Burned
╰⊷*${config.botName} Online*`;
    await reply(txt);
  }
});
