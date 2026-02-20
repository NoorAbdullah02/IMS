import { db } from './src/db/index.js';
import { admitCards } from './src/db/schema.js';

const cards = await db.select().from(admitCards);
console.log(JSON.stringify(cards, null, 2));
process.exit(0);
