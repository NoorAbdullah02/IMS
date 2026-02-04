import { db } from './src/db/index.js';
import { policies } from './src/db/schema.js';

const checkPolicies = async () => {
    const all = await db.select().from(policies);
    console.log('Policies in DB:', JSON.stringify(all, null, 2));
    process.exit(0);
};

checkPolicies();
