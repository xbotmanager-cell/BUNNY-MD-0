import { config } from './config.js';

const commands = new Map();

export function registerCommand(cmd) {
  commands.set(cmd.name, cmd);
  if (cmd.aliases) {
    for (const alias of cmd.aliases) {
      commands.set(alias, cmd);
    }
  }
}

export function getCommands() {
  return commands;
}

export async function handleMessage(sock, msg) {
  if (!msg.message) return;

  const text = msg.message.conversation ||
    msg.message.extendedTextMessage?.text ||
    msg.message.imageMessage?.caption ||
    msg.message.videoMessage?.caption || '';

  if (!text.startsWith(config.prefix)) return;

  const args = text.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();

  if (!commandName) return;

  const cmd = commands.get(commandName);
  if (cmd) {
    const sender = msg.key.participant || msg.key.remoteJid;
    const senderNum = sender.split('@')[0];
    const isGroup = msg.key.remoteJid?.endsWith('@g.us');

    let isOwner = msg.key.fromMe;
    if (config.ownerNumber) {
        const owners = config.ownerNumber.split(',').map(n => n.trim());
        if (owners.includes(senderNum)) isOwner = true;
    }

    const mode = config.mode.toLowerCase();

    if (!isOwner) {
      if (mode === 'private' || mode === 'maintenance') return;
      if (mode === 'groups' && !isGroup) return;
      if (mode === 'dm' && isGroup) return;
    }

    const reply = async (replyText) => {
      return sock.sendMessage(msg.key.remoteJid, { text: replyText }, { quoted: msg });
    };
    const replyWithImage = async (replyText, url) => {
      return sock.sendMessage(msg.key.remoteJid, { image: { url }, caption: replyText }, { quoted: msg });
    }
    const react = async (emoji) => {
      if (config.cmdReact) {
        return sock.sendMessage(msg.key.remoteJid, { react: { text: emoji, key: msg.key } });
      }
    };

    try {
      if (cmd.reactEmoji) {
        await react(cmd.reactEmoji);
      }
      await cmd.execute({ sock, msg, args, sender, isGroup, reply, replyWithImage, react, isOwner });
    } catch (e) {
      console.error(`Command ${commandName} failed:`, e);
      reply("Oops! You broke something, idiot. Stop trying to crash me.");
    }
  }
}
