import { db } from './src/db/index.js';
import { users } from './src/db/schema.js';

const checkUsers = async () => {
    const allUsers = await db.select().from(users);
    console.log('Users in DB:', allUsers.map(u => u.email));
    process.exit(0);
};

checkUsers();
