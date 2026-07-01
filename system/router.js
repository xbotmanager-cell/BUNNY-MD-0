import { handleMessage } from './commandhandler.js';

export const router = async (sock, msg) => {
  await handleMessage(sock, msg);
};
