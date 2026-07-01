import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { logger } from './logger.js';

export async function loadPlugins() {
  const pluginsDir = path.join(process.cwd(), 'plugins/commands');
  if (!fs.existsSync(pluginsDir)) return;

  const categories = fs.readdirSync(pluginsDir);

  for (const category of categories) {
    const categoryPath = path.join(pluginsDir, category);
    if (fs.statSync(categoryPath).isDirectory()) {
      const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));
      for (const file of files) {
        const filePath = pathToFileURL(path.join(categoryPath, file)).href;
        try {
          await import(filePath);
          logger.info(`Loaded command: ${file}`);
        } catch (e) {
          logger.error(`Failed to load command ${file}:`, e);
        }
      }
    }
  }
}
