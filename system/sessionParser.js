import fs from 'fs';
import path from 'path';

export function fixExistingCreds() {
  try {
    const credsPath = path.join(process.cwd(), 'session', 'creds.json');
    if (fs.existsSync(credsPath)) {
      // Just check if it's readable
      const credsString = fs.readFileSync(credsPath, 'utf-8');
      JSON.parse(credsString);
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
    const creds = JSON.parse(jsonString, (key, value) => {
      // Basic Buffer parsing for legacy formats if needed, but no array mangling
      if (value && value.type === 'Buffer' && Array.isArray(value.data)) {
        return value; 
      }
      return value;
    });

    const sessionDir = path.join(process.cwd(), 'session');
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }

    const credsPath = path.join(sessionDir, 'creds.json');
    fs.writeFileSync(credsPath, JSON.stringify(creds, null, 2));
    console.log('Successfully loaded credentials from SESSION_ID');
    return true;
  } catch (err) {
    console.error('Failed to parse SESSION_ID:', err);
    return false;
  }
}

