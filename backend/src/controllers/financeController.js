import { db } from '../db/index.js';
import { payments, semesterRegistrations, users, semesters, departments, settings, notifications } from '../db/schema.js';
import { eq, and, desc, sql, ne } from 'drizzle-orm';
import { createNotification } from './notificationController.js';

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

        // Use database transaction to ensure atomicity (all-or-nothing)
        await db.transaction(async (tx) => {
            const [payment] = await tx.select().from(payments).where(eq(payments.id, parseInt(paymentId)));
            if (!payment) {
                throw new Error('Payment record not found');
            }

            // Step 1: Update payment status
            await tx.update(payments).set({
                status,
                verifiedBy: req.user.id,
                rejectedReason: status === 'rejected' ? remarks : null
            }).where(eq(payments.id, parseInt(paymentId)));

            // Step 2: Update registration status based on payment verification
            if (status === 'verified') {
                // Mark as paid when payment is verified
                await tx.update(semesterRegistrations).set({
                    isPaid: true
                }).where(and(
                    eq(semesterRegistrations.studentId, payment.studentId),
                    eq(semesterRegistrations.semesterId, payment.semesterId)
                ));

                // Step 3: Create success notification
                await tx.insert(notifications).values({
                    userId: payment.studentId,
                    title: 'Payment Verified',
                    message: `Your payment of ${payment.amount} BDT has been verified. Academic access is now unlocked.`,
                    type: 'success',
                    isRead: false
                });

                console.log(`[Transaction] ✅ Payment ${paymentId} verified for Student ${payment.studentId}`);
            } else {
                // If payment is rejected, check if there are other verified payments
                const otherVerified = await tx.select().from(payments).where(and(
                    eq(payments.studentId, payment.studentId),
                    eq(payments.semesterId, payment.semesterId),
                    eq(payments.status, 'verified'),
                    ne(payments.id, parseInt(paymentId))
                ));

                // If no other verified payments exist, lock access
                if (otherVerified.length === 0) {
                    await tx.update(semesterRegistrations).set({
                        isPaid: false,
                        isRegistered: false // Lock registration too
                    }).where(and(
                        eq(semesterRegistrations.studentId, payment.studentId),
                        eq(semesterRegistrations.semesterId, payment.semesterId)
                    ));
                }

                // Step 3: Create rejection notification
                if (status === 'rejected') {
                    await tx.insert(notifications).values({
                        userId: payment.studentId,
                        title: 'Payment Rejected',
                        message: `Your payment of ${payment.amount} BDT was rejected. Reason: ${remarks || 'No reason provided'}. Please resubmit with correct details.`,
                        type: 'error',
                        isRead: false
                    });
                }

                console.log(`[Transaction] ❌ Payment ${paymentId} ${status} for Student ${payment.studentId}`);
            }
        });

        // Transaction completed successfully
        res.json({
            message: `Payment ${status} successfully`,
            success: true
        });
    } catch (error) {
        console.error('[Transaction] Payment verification failed:', error);
        // Transaction automatically rolled back on error
        res.status(500).json({
            message: error.message || 'Payment verification failed. Transaction rolled back.',
            success: false
        });
    }
};

// --- Student Actions ---

export const submitPayment = async (req, res) => {
    try {
        const { amount, method, transactionId, semesterId } = req.body;
        const studentId = parseInt(req.user.id);
        const proofUrl = req.file ? req.file.path : null;

        console.log(`[Finance] Submission Attempt: Student:${studentId}, Sem:${semesterId}, Amount:${amount}, TRX:${transactionId}`);
        if (req.file) console.log(`[Finance] Proof uploaded to: ${proofUrl}`);

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
        console.error('[Finance] Submission Error:', error);
        if (error.code === '23505') { // Postgres unique_violation
            return res.status(400).json({ message: 'This Transaction ID has already been used. Please check your records.' });
        }
        res.status(500).json({ message: 'Failed to process payment. Please try again.' });
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

        // Calculate VERIFIED payment progress for current semester
        const verifiedPayments = await db.select().from(payments).where(and(
            eq(payments.studentId, studentId),
            eq(payments.semesterId, sem.id),
            eq(payments.status, 'verified')
        ));

        // Calculate PENDING payment progress for current semester
        const pendingPayments = await db.select().from(payments).where(and(
            eq(payments.studentId, studentId),
            eq(payments.semesterId, sem.id),
            eq(payments.status, 'pending')
        ));

        console.log(`[FinanceStatus] Student:${studentId} Sem:${sem.id} Found ${pendingPayments.length} pending payments totaling: ${pendingPayments.reduce((s, p) => s + p.amount, 0)}`);

        const totalPaid = verifiedPayments.reduce((sum, p) => sum + p.amount, 0);
        const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

        // Calculate advance payment (overpayment for current semester)
        const overpayment = Math.max(0, totalPaid - perSemesterFee);
        const effectivePaid = Math.min(totalPaid, perSemesterFee);
        const paymentPercentage = (effectivePaid / perSemesterFee) * 100;

        // Calculate remaining balance (accounting for pending and advance)
        let remainingBalance = perSemesterFee - effectivePaid - totalPending;

        // If there's overpayment, it becomes advance for next semester
        const advancePayment = overpayment;

        // Ensure remaining balance doesn't go negative
        if (remainingBalance < 0) {
            remainingBalance = 0;
        }

        // Installment suggestions
        const installment1 = Math.round(perSemesterFee * 0.30); // 30%
        const installment2 = Math.round(perSemesterFee * 0.30); // 30%
        const installment3 = perSemesterFee - installment1 - installment2; // 40% (remaining)

        res.json({
            feeStructure: {
                totalProgramFee: totalFee,
                perSemesterFee,
                department: user.department,
                installments: {
                    first: installment1,   // 30%
                    second: installment2,  // 30%
                    third: installment3    // 40%
                }
            },
            currentSemester: sem,
            registration: regStatus,
            payments: myPayments,
            paymentProgress: {
                totalPaid: effectivePaid,
                totalPending,
                advancePayment,
                paymentPercentage: Math.round(paymentPercentage),
                remainingBalance,
                hasMinimumPayment: paymentPercentage >= 30,
                isFullyPaid: paymentPercentage >= 100
            }
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
