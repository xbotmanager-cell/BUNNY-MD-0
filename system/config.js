import { dbData, saveDB } from './db.js';

export const config = {
  get prefix() { return dbData?.config?.prefix || process.env.PREFIX || '∆'; },
  get botName() { return dbData?.config?.botName || process.env.BOT_NAME || 'BUNNY MD'; },
  get botImage() { return dbData?.config?.botImage || process.env.BOT_IMAGE || 'https://i.ibb.co/Mdg2Fkd/file-00000000f41871fdb744b8a6b7b612fa.png'; },
  get cmdReact() { return dbData?.config?.cmdReact !== undefined ? dbData.config.cmdReact : true; },
  get mode() { return dbData?.config?.mode || process.env.MODE || 'public'; },
  get ownerNumber() { return dbData?.config?.ownerNumber || process.env.OWNER_NUMBER || ''; }
};

export async function updateConfig(key, value) {
  if (!dbData.config) dbData.config = {};
  dbData.config[key] = value;
  await saveDB();
}
