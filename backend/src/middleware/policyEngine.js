import { db } from '../db/index.js';
import { policies } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

export const evaluatePolicy = async (user, action, resource, context = {}) => {
    try {
        // 1. Fetch relevant policies from DB
        const relevantPolicies = await db.select()
            .from(policies)
            .where(and(
                eq(policies.subject, user.role),
                eq(policies.action, action),
                eq(policies.resource, resource)
            ));

        if (relevantPolicies.length === 0) {
            // Default Deny if no policy exists (or allow if you want role-based fallback)
            // For now, let's allow admins everything as a fallback
            if (user.role === 'super_admin' || user.role === 'admin') return true;
            return false;
        }

        // 2. Evaluate conditions for each policy
        for (const policy of relevantPolicies) {
            if (!policy.conditions) {
                if (policy.allow) return true;
                continue;
            }

            const rules = JSON.parse(policy.conditions);
            const isMatch = checkConditions(rules, { user, context });

            if (isMatch) {
                return policy.allow;
            }
        }

        return false; // No matching policy allowed the action
    } catch (err) {
        console.error('Policy Evaluation Error:', err);
        return false;
    }
};

const checkConditions = (rules, data) => {
    // Basic rule engine logic
    // rules: { allOf: [{ field: 'user.department', op: 'eq', value: 'context.department' }] }

    if (rules.allOf) {
        return rules.allOf.every(rule => evaluateRule(rule, data));
    }
    if (rules.anyOf) {
        return rules.anyOf.some(rule => evaluateRule(rule, data));
    }

    return evaluateRule(rules, data);
};

const evaluateRule = (rule, data) => {
    const { field, op, value } = rule;

    // Resolve dots in field names (e.g. "user.id")
    const fieldValue = field.split('.').reduce((obj, key) => obj?.[key], data);

    // Resolve value if it refers to context (e.g. "$context.courseId")
    let targetValue = value;
    if (typeof value === 'string' && value.startsWith('$')) {
        targetValue = value.substring(1).split('.').reduce((obj, key) => obj?.[key], data);
    }

    switch (op) {
        case 'eq': return fieldValue === targetValue;
        case 'neq': return fieldValue !== targetValue;
        case 'gt': return fieldValue > targetValue;
        case 'lt': return fieldValue < targetValue;
        case 'in': return Array.isArray(targetValue) && targetValue.includes(fieldValue);
        default: return false;
    }
};
