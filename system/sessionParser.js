import fs from 'fs';
import path from 'path';

function fixCreds(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return obj; // Already in the right format for Baileys
  }

  // Check if it's an object with only numeric keys (like what JSON.stringify does to Uint8Array)
  const keys = Object.keys(obj);
  if (keys.length > 0 && keys.every(k => !isNaN(Number(k)))) {
    const arr = [];
    for (let i = 0; i < keys.length; i++) {
      if (obj[String(i)] !== undefined) {
        arr.push(obj[String(i)]);
      }
    }
    // Return Baileys compatible Buffer JSON object
    return { type: 'Buffer', data: arr };
  }

  for (const key in obj) {
    obj[key] = fixCreds(obj[key]);
  }
  return obj;
}

export function fixExistingCreds() {
  try {
    const credsPath = path.join(process.cwd(), 'session', 'creds.json');
    if (fs.existsSync(credsPath)) {
      const credsString = fs.readFileSync(credsPath, 'utf-8');
      const creds = JSON.parse(credsString);
      const fixedCreds = fixCreds(creds);
      fs.writeFileSync(credsPath, JSON.stringify(fixedCreds, null, 2));
      console.log('Verified and fixed existing credentials');
    }
  } catch (err) {
    console.error('Failed to verify existing creds:', err);
  }
}

export function parseSessionId(sessionId) {

  try {
    if (!sessionId.startsWith('SWIFTBOT~')) {
      console.error('Invalid SESSION_ID format. Must start with SWIFTBOT~');
      return false;
    }

    const base64Data = sessionId.replace('SWIFTBOT~', '');
    const jsonString = Buffer.from(base64Data, 'base64').toString('utf-8');
    const creds = JSON.parse(jsonString);

    const fixedCreds = fixCreds(creds);

    const sessionDir = path.join(process.cwd(), 'session');
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }

    const credsPath = path.join(sessionDir, 'creds.json');
    fs.writeFileSync(credsPath, JSON.stringify(fixedCreds, null, 2));
    console.log('Successfully loaded credentials from SESSION_ID');
    return true;
  } catch (err) {
    console.error('Failed to parse SESSION_ID:', err);
    return false;
  }
}

