import { db } from '../db/index.js';
import { policies } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

// Get all policies
export const getPolicies = async (req, res) => {
    try {
        const list = await db.select().from(policies).orderBy(desc(policies.createdAt));
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create or Update Policy
export const upsertPolicy = async (req, res) => {
    try {
        const { id, subject, action, resource, conditions, allow, description } = req.body;

        if (id) {
            // Update
            await db.update(policies)
                .set({
                    subject,
                    action,
                    resource,
                    conditions: conditions ? JSON.stringify(conditions) : null,
                    allow: allow ?? true,
                    description
                })
                .where(eq(policies.id, parseInt(id)));
            res.json({ message: 'Policy updated successfully' });
        } else {
            // Create
            const [newPolicy] = await db.insert(policies).values({
                subject,
                action,
                resource,
                conditions: conditions ? JSON.stringify(conditions) : null,
                allow: allow ?? true,
                description
            }).returning();
            res.status(201).json({ message: 'Policy created successfully', policy: newPolicy });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Policy
export const deletePolicy = async (req, res) => {
    try {
        const { id } = req.params;
        await db.delete(policies).where(eq(policies.id, parseInt(id)));
        res.json({ message: 'Policy deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
