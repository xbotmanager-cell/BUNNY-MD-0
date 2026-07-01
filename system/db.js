import fs from 'fs';

export let dbData = { config: {} };

export async function loadDB() {
  if (process.env.MONGODB_URI) {
    try {
      const { MongoClient } = await import('mongodb');
      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
      const db = client.db('bunny_md');
      const doc = await db.collection('data').findOne({ _id: 'bot_data' });
      if (doc) dbData = doc.data || { config: {} };
      console.log('Loaded DB from MongoDB');
    } catch (e) { console.error('MongoDB load error:', e); }
  } else if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
      const { data: row, error } = await supabase.from('bot_data').select('data').eq('id', 'main').single();
      if (row) dbData = row.data || { config: {} };
      console.log('Loaded DB from Supabase');
    } catch (e) { console.error('Supabase load error:', e); }
  } else {
    // RAM / Local file fallback
    if (fs.existsSync('./database.json')) {
      try {
        dbData = JSON.parse(fs.readFileSync('./database.json', 'utf8'));
        if (!dbData.config) dbData.config = {};
        console.log('Loaded DB from local JSON file');
      } catch(e) {}
    }
  }
  return dbData;
}

export async function saveDB() {
  if (process.env.MONGODB_URI) {
    try {
      const { MongoClient } = await import('mongodb');
      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
      await client.db('bunny_md').collection('data').updateOne({ _id: 'bot_data' }, { $set: { data: dbData } }, { upsert: true });
    } catch(e){}
  } else if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
      await supabase.from('bot_data').upsert({ id: 'main', data: dbData });
    } catch(e){}
  } else {
    fs.writeFileSync('./database.json', JSON.stringify(dbData, null, 2));
  }
}
