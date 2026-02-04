import { db } from '../db/index.js';
import { materials } from '../db/schema.js';

const debug = async () => {
    try {
        const allMaterials = await db.select().from(materials);
        console.log('--- ALL MATERIALS ---');
        console.table(allMaterials.map(m => ({ id: m.id, title: m.title, url: m.fileUrl })));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

debug();
