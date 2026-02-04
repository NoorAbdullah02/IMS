import { db } from '../db/index.js';
import { payments, semesterRegistrations, users, semesters, departments, settings } from '../db/schema.js';
import { eq, and, desc, sql } from 'drizzle-orm';

// --- Treasurer Actions ---

export const getFinancialOverview = async (req, res) => {
    try {
        const totalCollected = await db.select({ value: sql`SUM(amount)` }).from(payments).where(eq(payments.status, 'verified'));
        const pendingApprovals = await db.select({ count: sql`COUNT(*)` }).from(payments).where(eq(payments.status, 'pending'));

        const deptStats = await db.select({
            department: users.department,
            collected: sql`SUM(amount)`,
            count: sql`COUNT(*)`
        })
            .from(payments)
            .innerJoin(users, eq(payments.studentId, users.id))
            .where(eq(payments.status, 'verified'))
            .groupBy(users.department);

        res.json({
            summary: {
                totalCollected: totalCollected[0]?.value || 0,
                pendingCount: pendingApprovals[0]?.count || 0
            },
            deptStats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPaymentsList = async (req, res) => {
    try {
        const { status, dept } = req.query;
        let query = db.select({
            id: payments.id,
            amount: payments.amount,
            method: payments.method,
            transactionId: payments.transactionId,
            status: payments.status,
            createdAt: payments.createdAt,
            studentName: users.name,
            studentId: users.studentId,
            department: users.department
        })
            .from(payments)
            .innerJoin(users, eq(payments.studentId, users.id));

        const conditions = [];
        if (status) conditions.push(eq(payments.status, status));
        if (dept) conditions.push(eq(users.department, dept));

        if (conditions.length > 0) {
            query = query.where(and(...conditions));
        }

        const list = await query.orderBy(desc(payments.createdAt));
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { status, remarks } = req.body; // 'verified' or 'rejected'

        const [payment] = await db.select().from(payments).where(eq(payments.id, parseInt(paymentId)));
        if (!payment) return res.status(404).json({ message: 'Payment record not found' });

        await db.update(payments).set({
            status,
            verifiedBy: req.user.id,
            rejectedReason: status === 'rejected' ? remarks : null
        }).where(eq(payments.id, parseInt(paymentId)));

        // If verified, unlock registration
        if (status === 'verified') {
            await db.update(semesterRegistrations).set({
                isPaid: true
            }).where(and(
                eq(semesterRegistrations.studentId, payment.studentId),
                eq(semesterRegistrations.semesterId, payment.semesterId)
            ));
        }

        res.json({ message: `Payment ${status} successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Student Actions ---

export const submitPayment = async (req, res) => {
    try {
        const { amount, method, transactionId, semesterId } = req.body;
        const studentId = req.user.id;
        const proofUrl = req.file ? req.file.path : null;

        const [newPayment] = await db.insert(payments).values({
            studentId,
            semesterId: parseInt(semesterId),
            amount: parseInt(amount),
            method,
            transactionId,
            proofUrl,
            status: 'pending'
        }).returning();

        res.status(201).json({ message: 'Payment submitted for verification', payment: newPayment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyFinancialStatus = async (req, res) => {
    try {
        const studentId = req.user.id;
        const [user] = await db.select().from(users).where(eq(users.id, studentId));
        const [dept] = await db.select().from(departments).where(eq(departments.name, user.department));

        const currentSemKey = await db.select().from(settings).where(eq(settings.key, 'current_semester'));
        const currentSemName = currentSemKey[0]?.value;
        const [sem] = await db.select().from(semesters).where(eq(semesters.name, currentSemName));

        const [regStatus] = await db.select().from(semesterRegistrations).where(and(
            eq(semesterRegistrations.studentId, studentId),
            eq(semesterRegistrations.semesterId, sem.id)
        ));

        const myPayments = await db.select().from(payments)
            .where(eq(payments.studentId, studentId))
            .orderBy(desc(payments.createdAt));

        const totalFee = dept?.totalProgramFee || 400000;
        const perSemesterFee = totalFee / 8;

        res.json({
            feeStructure: {
                totalProgramFee: totalFee,
                perSemesterFee,
                department: user.department
            },
            currentSemester: sem,
            registration: regStatus,
            payments: myPayments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const confirmRegistration = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { semesterId } = req.body;

        const [status] = await db.select().from(semesterRegistrations).where(and(
            eq(semesterRegistrations.studentId, studentId),
            eq(semesterRegistrations.semesterId, parseInt(semesterId))
        ));

        if (!status || !status.isPaid) {
            return res.status(403).json({ message: 'Registration locked. Please clear your semester fees first.' });
        }

        await db.update(semesterRegistrations).set({
            isRegistered: true
        }).where(and(
            eq(semesterRegistrations.studentId, studentId),
            eq(semesterRegistrations.semesterId, parseInt(semesterId))
        ));

        res.json({ message: 'Course registration confirmed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
