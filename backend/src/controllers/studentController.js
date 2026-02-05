import { db } from '../db/index.js';
import { users, results, notices, courses, enrollments, courseAssignments, admitCards, semesterRegistrations, semesters, departments, payments } from '../db/schema.js';
import { eq, and, or, isNull } from 'drizzle-orm';

// Payment Milestones:
// 30% - Unlocks all academic access (courses, materials, results, enrollment)
// 65% - Unlocks Midterm Admit Card download
// 100% - Unlocks Final Exam Admit Card download

const checkRegistration = async (studentId, semesterName) => {
    const sId = parseInt(studentId);

    // Find semester ID from name
    const [sem] = await db.select().from(semesters).where(eq(semesters.name, semesterName));
    if (!sem) {
        console.warn(`[RegistrationCheck] Semester not found: ${semesterName}`);
        return { authorized: false, reason: 'semester_not_found' };
    }

    const [reg] = await db.select().from(semesterRegistrations).where(and(
        eq(semesterRegistrations.studentId, sId),
        eq(semesterRegistrations.semesterId, sem.id)
    ));

    if (!reg) {
        console.warn(`[RegistrationCheck] No registration record for Student:${sId} in Semester:${sem.id}`);
        return { authorized: false, reason: 'no_registration_record' };
    }

    // Get student's department to calculate required fee
    const [student] = await db.select().from(users).where(eq(users.id, sId));
    if (!student) return { authorized: false, reason: 'student_not_found' };

    const [dept] = await db.select().from(departments).where(eq(departments.name, student.department));
    const totalFee = dept?.totalProgramFee || 400000;
    const perSemesterFee = totalFee / 8;

    // Calculate total verified payments for this semester
    const verifiedPayments = await db.select().from(payments).where(and(
        eq(payments.studentId, sId),
        eq(payments.semesterId, sem.id),
        eq(payments.status, 'verified')
    ));

    const totalPaid = verifiedPayments.reduce((sum, p) => sum + p.amount, 0);
    const paymentPercentage = (totalPaid / perSemesterFee) * 100;

    // NEW: 30% unlocks FULL academic access (courses, materials, results)
    const hasBasicAccess = paymentPercentage >= 30;
    const hasMidtermAccess = paymentPercentage >= 65;
    const hasFinalAccess = paymentPercentage >= 100;

    // Only require registration confirmation + 30% payment for basic access
    const authorized = hasBasicAccess && reg.isRegistered;

    if (!authorized) {
        console.warn(`[RegistrationCheck] Access Denied for Student:${sId}. Paid:${paymentPercentage.toFixed(1)}%, Registered:${reg.isRegistered}`);
        return {
            authorized: false,
            reason: !hasBasicAccess ? 'insufficient_payment' : 'not_registered',
            paymentPercentage: paymentPercentage.toFixed(1),
            isRegistered: reg.isRegistered,
            requiredAmount: perSemesterFee,
            paidAmount: totalPaid,
            hasBasicAccess,
            hasMidtermAccess,
            hasFinalAccess
        };
    }

    return {
        authorized: true,
        paymentPercentage: paymentPercentage.toFixed(1),
        hasBasicAccess,
        hasMidtermAccess,
        hasFinalAccess,
        paidAmount: totalPaid,
        requiredAmount: perSemesterFee
    };
};

export const getMyAdmitCards = async (req, res) => {
    try {
        const semester = req.query.semester ? req.query.semester.trim() : null;
        const studentId = parseInt(req.user.id);

        if (!semester) {
            return res.status(400).json({ message: 'Semester is required' });
        }

        // Check registration
        const regCheck = await checkRegistration(studentId, semester);
        if (!regCheck.authorized) {
            let message = 'Academic access locked.';
            if (regCheck.reason === 'insufficient_payment') {
                message = `Payment required: You've paid ${regCheck.paymentPercentage}% (${regCheck.paidAmount.toLocaleString()} BDT). Minimum 30% (${(regCheck.requiredAmount * 0.3).toLocaleString()} BDT) required. Please visit Finance Hub to make a payment.`;
            } else if (regCheck.reason === 'not_registered') {
                message = `Registration incomplete: Payment verified (${regCheck.paymentPercentage}%), but you haven't confirmed your semester registration. Please visit Finance Hub to complete registration.`;
            }
            return res.status(403).json({ message, details: regCheck });
        }

        const myAdmitCards = await db.select().from(admitCards)
            .where(and(
                eq(admitCards.studentId, studentId),
                eq(admitCards.semester, semester)
            ));

        res.json(myAdmitCards);
    } catch (error) {
        console.error('getMyAdmitCards Error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const downloadAdmitCard = async (req, res) => {
    try {
        const { studentId, semester } = req.params;
        const sId = parseInt(studentId);

        // Security Check: Only the student themselves or a staff member can download
        if (req.user.role === 'student' && parseInt(req.user.id) !== sId) {
            return res.status(403).json({ message: 'Unauthorized access to credentials.' });
        }

        // Fetch student details for the PDF
        const [student] = await db.select().from(users).where(eq(users.id, sId));
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check registration status and get payment details
        const regCheck = await checkRegistration(sId, semester);

        if (!regCheck.authorized && req.user.role === 'student') {
            let message = 'Download blocked.';
            if (regCheck.reason === 'insufficient_payment') {
                message = `Payment required: ${regCheck.paymentPercentage}% paid. Minimum 30% required.`;
            } else if (regCheck.reason === 'not_registered') {
                message = 'Registration incomplete. Please complete registration in Finance Hub.';
            }
            return res.status(403).json({ message, details: regCheck });
        }

        // Fetch admit card
        const [card] = await db.select().from(admitCards).where(and(
            eq(admitCards.studentId, sId),
            eq(admitCards.semester, semester)
        ));

        if (!card) {
            return res.status(404).json({ message: 'Admit card not found for this semester' });
        }

        // NEW: Check payment milestone based on exam type
        if (req.user.role === 'student' && regCheck.authorized) {
            const examName = card.examName.toLowerCase();

            if (examName.includes('midterm') || examName.includes('mid')) {
                if (!regCheck.hasMidtermAccess) {
                    return res.status(403).json({
                        message: `Midterm Admit Card requires 65% payment. You've paid ${regCheck.paymentPercentage}%. Please make your second payment (${((regCheck.requiredAmount * 0.65) - regCheck.paidAmount).toLocaleString()} BDT more) to download.`,
                        details: regCheck,
                        requiredPercentage: 65,
                        examType: 'midterm'
                    });
                }
            } else if (examName.includes('final')) {
                if (!regCheck.hasFinalAccess) {
                    return res.status(403).json({
                        message: `Final Exam Admit Card requires 100% payment. You've paid ${regCheck.paymentPercentage}%. Please make your final payment (${(regCheck.requiredAmount - regCheck.paidAmount).toLocaleString()} BDT more) to download.`,
                        details: regCheck,
                        requiredPercentage: 100,
                        examType: 'final'
                    });
                }
            }
        }

        // Generate a simple "Digital Voucher" PDF (Simulation)
        // In a real production app, we would use 'pdfkit' or 'puppeteer'
        // For this demo, we return a Buffer that represents a simulated file
        const timestamp = new Date().toISOString();
        const content = `
==================================================
BAUET INSTITUTIONAL MANAGEMENT SYSTEM
OFFICIAL EXAMINATION HALL TICKET
==================================================
STUDENT NAME: ${student.name.toUpperCase()}
STUDENT ID  : ${student.studentId || sId}
DEPARTMENT  : ${student.department}
SEMESTER    : ${semester.toUpperCase()}
EXAM STATUS : AUTHORIZED
--------------------------------------------------
VERIFIED BY : GOVERNANCE HUB
TIMESTAMP   : ${timestamp}
DIGITAL SIGNATURE: [SECURE_HASH_${Math.random().toString(36).substring(7).toUpperCase()}]
==================================================
This is a computer-generated digital credential.
Physical signature is not required.
        `;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=AdmitCard_${student.studentId || sId}_${semester.replace(/\s+/g, '_')}.pdf`);

        // Convert string to Buffer and send
        res.send(Buffer.from(content, 'utf-8'));
    } catch (error) {
        console.error('downloadAdmitCard Error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const sId = parseInt(req.user.id);
        const [user] = await db.select().from(users).where(eq(users.id, sId));
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Exclude password
        const { password, ...profile } = user;
        res.json(profile);
    } catch (error) {
        console.error('getAdmitCards Error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getResults = async (req, res) => {
    try {
        const semester = req.query.semester ? req.query.semester.trim() : null;
        const studentId = parseInt(req.user.id);

        if (semester) {
            const regCheck = await checkRegistration(studentId, semester);
            if (!regCheck.authorized) {
                let message = 'Results locked.';
                if (regCheck.reason === 'insufficient_payment') {
                    message = `Payment required: ${regCheck.paymentPercentage}% paid. Minimum 30% required to access results.`;
                } else if (regCheck.reason === 'not_registered') {
                    message = 'Registration incomplete. Please complete registration to view results.';
                }
                return res.status(403).json({ message, details: regCheck });
            }
        }

        let whereClause = and(
            eq(results.studentId, studentId),
            eq(results.published, true)
        );

        if (semester) {
            whereClause = and(whereClause, eq(results.semester, semester));
        }

        const studentResults = await db.select({
            id: results.id,
            courseCode: courses.code,
            courseTitle: courses.title,
            examType: results.examType,
            marks: results.marks,
            grade: results.grade,
            semester: results.semester,
            fileUrl: results.fileUrl
        })
            .from(results)
            .innerJoin(courses, eq(results.courseId, courses.id))
            .where(whereClause);

        res.json(studentResults);
    } catch (error) {
        console.error('getAdmitCards Error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getNotices = async (req, res) => {
    try {
        const studentId = parseInt(req.user.id);
        const [student] = await db.select().from(users).where(eq(users.id, studentId));

        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Fetch notices: 
        // 1. Where department is null (global) or matches student department
        // 2. Where targetRole is null (all) or matches 'student'
        const studentNotices = await db.select({
            id: notices.id,
            title: notices.title,
            content: notices.content,
            attachmentUrl: notices.attachmentUrl,
            createdAt: notices.createdAt,
            posterName: users.name
        })
            .from(notices)
            .leftJoin(users, eq(notices.postedBy, users.id))
            .where(and(
                or(isNull(notices.department), eq(notices.department, student.department)),
                or(isNull(notices.targetRole), eq(notices.targetRole, 'student'))
            ));

        res.json(studentNotices);
    } catch (error) {
        console.error('getAdmitCards Error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getMyCourses = async (req, res) => {
    try {
        const semester = req.query.semester ? req.query.semester.trim() : null;
        const studentId = parseInt(req.user.id);

        if (!semester) {
            return res.status(400).json({ message: 'Semester is required' });
        }

        // Check registration
        const regCheck = await checkRegistration(studentId, semester);
        if (!regCheck.authorized) {
            let message = 'Academic access locked.';
            if (regCheck.reason === 'insufficient_payment') {
                message = `Payment required: ${regCheck.paymentPercentage}% paid. Minimum 30% required to access courses.`;
            } else if (regCheck.reason === 'not_registered') {
                message = 'Registration incomplete. Please complete registration to view courses.';
            }
            return res.status(403).json({ message, details: regCheck, locked: true });
        }

        // Fetch student info to get batch and department
        const [student] = await db.select().from(users).where(eq(users.id, studentId));
        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Build filters for courses assigned to this student's batch and department
        const filters = [
            eq(courses.department, student.department),
            eq(courses.batch, student.batch)
        ];

        // Join with courseAssignments to see if this course is active in this semester
        const studentCourses = await db.select({
            id: courses.id,
            code: courses.code,
            title: courses.title,
            credit: courses.credit,
            batch: courses.batch,
            teacherName: users.name,
            semester: courseAssignments.semester
        })
            .from(courses)
            .leftJoin(courseAssignments, and(
                eq(courseAssignments.courseId, courses.id),
                eq(courseAssignments.semester, semester)
            ))
            .leftJoin(users, eq(courseAssignments.teacherId, users.id))
            .where(and(...filters));

        res.json(studentCourses);
    } catch (error) {
        console.error('getAdmitCards Error:', error);
        res.status(500).json({ message: error.message });
    }
};
