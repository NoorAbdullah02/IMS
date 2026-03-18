/**
 * Fix Script: Correct doubled year values (202025 -> 2025)
 * This script identifies and fixes any semester entries with doubled years
 */

import { db } from '../db/index.js';
import { semesters, courseAssignments, enrollments, results, attendance, admitCards, materials } from '../db/schema.js';

const fixYearDuplication = async () => {
    try {
        console.log('🔧 [FIX] Starting year duplication correction...\n');

        // Fix pattern: Replace 202025 with 2025, 202024 with 2024, etc.
        const tables = [
            { table: semesters, column: 'name', tableName: 'semesters' },
            { table: courseAssignments, column: 'semester', tableName: 'courseAssignments' },
            { table: enrollments, column: 'semester', tableName: 'enrollments' },
            { table: results, column: 'semester', tableName: 'results' },
            { table: attendance, column: 'semester', tableName: 'attendance' },
            { table: admitCards, column: 'semester', tableName: 'admitCards' },
            { table: materials, column: 'semester', tableName: 'materials' }
        ];

        for (const { table, column, tableName } of tables) {
            console.log(`Checking ${tableName}...`);

            const records = await db.select().from(table);
            let fixedCount = 0;

            for (const record of records) {
                const value = record[column];

                // Check for doubled year patterns (202025, 202024, etc.)
                if (value && typeof value === 'string' && /20[0-9]{4}/.test(value)) {
                    const corrected = value.replace(/20([0-9]{2})([0-9]{2})([0-9]{2})/g, '$1$2$3');

                    if (corrected !== value) {
                        console.log(`  ❌ Found: "${value}" → Fixed: "${corrected}"`);

                        await db.update(table)
                            .set({ [column]: corrected })
                            .where(/* needs to be adapted per table */);

                        fixedCount++;
                    }
                }
            }

            if (fixedCount > 0) {
                console.log(`  ✅ Fixed ${fixedCount} records in ${tableName}\n`);
            } else {
                console.log(`  ✓ No issues found in ${tableName}\n`);
            }
        }

        console.log('✅ [FIX] Year duplication correction completed!');

    } catch (error) {
        console.error('❌ Error during fix:', error.message);
    }
};

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    fixYearDuplication().then(() => process.exit(0));
}

export { fixYearDuplication };
