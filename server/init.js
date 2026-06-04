const fs = require('fs');
const path = require('path');
const pool = require('./db');

const initDb = async () => {
  try {
    console.log('Running database schema migrations...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schemaSql);
    console.log('✅ Database tables recreated successfully');

    // Seed default passages
    const passagesCount = await pool.query('SELECT COUNT(*) FROM passages');
    if (parseInt(passagesCount.rows[0].count) === 0) {
      console.log('Seeding default passages...');
      const defaultPassages = [
        ["Storm Clouds", "The storm clouds rolled in over the horizon, flashing brilliant arches of lightning that lit up the typing arena. Speed and precision are the only shields in this thunderous duel. Keep your hands relaxed, find your keycap rhythm, and strike like a bolt from the blue.", "english", "medium"],
        ["Steady Hand", "A steady hand and a calm mind are the secret weapons of any champion. Focus on the flow of characters across the screen, let your muscle memory guide your fingers, and maintain your tempo through each word.", "english", "easy"],
        ["Mechanical Keys", "The click-clack of mechanical keys echoes in the quiet room. Each keypress is a step closer to the finish line. Do not rush, do not look back, just keep moving forward with precision and speed.", "english", "easy"]
      ];

      for (const [title, content, language, difficulty] of defaultPassages) {
        await pool.query(
          'INSERT INTO passages (title, content, language, difficulty) VALUES ($1, $2, $3, $4)',
          [title, content, language, difficulty]
        );
      }
      console.log('✅ Default passages seeded.');
    }
  } catch (err) {
    console.error('❌ Error initializing database:', err);
  } finally {
    pool.end();
  }
};

initDb();
