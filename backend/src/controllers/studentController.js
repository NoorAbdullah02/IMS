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

        // 1. Fetch Student Courses for this semester
        const studentCourses = await db.select({
            code: courses.code,
            title: courses.title
        })
            .from(enrollments)
            .innerJoin(courses, eq(enrollments.courseId, courses.id))
            .where(and(
                eq(enrollments.studentId, sId),
                eq(enrollments.semester, semester)
            ));

        // 2. Fetch Signatories
        const [deptHead] = await db.select({ name: users.name })
            .from(users)
            .where(and(eq(users.department, student.department), eq(users.role, 'dept_head')));

        const [treasurer] = await db.select({ name: users.name })
            .from(users)
            .where(eq(users.role, 'treasurer'));

        const timestamp = new Date().toLocaleDateString();
        const studentName = student.name.toUpperCase();
        const studentIdNumber = student.studentId || `STU-${sId}`;
        const deptName = student.department;
        const examName = card.examName.toUpperCase();
        const batch = student.batch || 'N/A';

        // Build PDF content stream
        let streamLines = [];
        // Border
        streamLines.push('q');
        streamLines.push('1.5 w');
        streamLines.push('30 30 552 732 re');
        streamLines.push('S');
        streamLines.push('Q');
        // Text
        streamLines.push('BT');
        streamLines.push('50 740 Td');
        streamLines.push('/F1 16 Tf');
        streamLines.push(`(BANGLADESH ARMY UNIVERSITY OF ENGINEERING & TECHNOLOGY) Tj`);
        streamLines.push('0 -25 Td');
        streamLines.push('/F1 10 Tf');
        streamLines.push(`(QADIRABAD CANTONMENT, NATORE-6431, BANGLADESH) Tj`);
        streamLines.push('0 -35 Td');
        streamLines.push('/F1 14 Tf');
        streamLines.push(`(E-ADMIT CARD: ${examName}) Tj`);
        streamLines.push('0 -35 Td');
        streamLines.push('/F1 11 Tf');
        streamLines.push(`(STUDENT CREDENTIALS) Tj`);
        streamLines.push('0 -22 Td');
        streamLines.push(`(FULL NAME      : ${studentName}) Tj`);
        streamLines.push('0 -16 Td');
        streamLines.push(`(STUDENT ID     : ${studentIdNumber}) Tj`);
        streamLines.push('0 -16 Td');
        streamLines.push(`(DEPARTMENT     : ${deptName}) Tj`);
        streamLines.push('0 -16 Td');
        streamLines.push(`(ACADEMIC BATCH : ${batch}) Tj`);
        streamLines.push('0 -30 Td');
        streamLines.push(`(ENROLLED COURSES FOR ${semester.toUpperCase()}) Tj`);

        if (studentCourses.length === 0) {
            streamLines.push('0 -18 Td (No enrolled courses found) Tj');
        } else {
            studentCourses.forEach((c, i) => {
                const displayTitle = c.title.length > 38 ? c.title.substring(0, 35) + '...' : c.title;
                // Escape parentheses in PDF strings
                const safeTitle = `${i + 1}. ${c.code}: ${displayTitle}`.replace(/[()\\]/g, '\\$&');
                streamLines.push(`0 -18 Td (${safeTitle}) Tj`);
            });
        }

        streamLines.push('0 -50 Td');
        streamLines.push('(___________________________________     ___________________________________) Tj');
        streamLines.push('0 -18 Td');
        streamLines.push(`(${(deptHead?.name || 'Head of Department').replace(/[()\\]/g, '\\$&')}                    ${(treasurer?.name || 'Treasurer').replace(/[()\\]/g, '\\$&')}) Tj`);
        streamLines.push('0 -14 Td');
        streamLines.push('(Head of Department                     University Treasurer) Tj');
        streamLines.push('0 -40 Td');
        streamLines.push('/F1 8 Tf');
        streamLines.push(`(Serial: BAUET-${sId}-${Date.now().toString().slice(-6)}  |  Issued: ${timestamp}  |  System Authenticated) Tj`);
        streamLines.push('ET');

        const streamContent = streamLines.join('\n');
        const streamLength = Buffer.byteLength(streamContent, 'utf-8');

        // Build PDF objects with correct offsets
        const objects = [];
        objects.push(`%PDF-1.4`);

        const offsets = [];

        // Object 1 - Catalog
        offsets.push(Buffer.byteLength(objects.join('\n') + '\n', 'utf-8'));
        objects.push(`1 0 obj\n<</Type/Catalog/Pages 2 0 R>>\nendobj`);

        // Object 2 - Pages
        offsets.push(Buffer.byteLength(objects.join('\n') + '\n', 'utf-8'));
        objects.push(`2 0 obj\n<</Type/Pages/Kids[3 0 R]/Count 1>>\nendobj`);

        // Object 3 - Page
        offsets.push(Buffer.byteLength(objects.join('\n') + '\n', 'utf-8'));
        objects.push(`3 0 obj\n<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>\nendobj`);

        // Object 4 - Font
        offsets.push(Buffer.byteLength(objects.join('\n') + '\n', 'utf-8'));
        objects.push(`4 0 obj\n<</Type/Font/Subtype/Type1/BaseFont/Helvetica-Bold>>\nendobj`);

        // Object 5 - Content Stream
        offsets.push(Buffer.byteLength(objects.join('\n') + '\n', 'utf-8'));
        objects.push(`5 0 obj\n<</Length ${streamLength}>>\nstream\n${streamContent}\nendstream\nendobj`);

        // xref
        const xrefOffset = Buffer.byteLength(objects.join('\n') + '\n', 'utf-8');

        let xref = `xref\n0 6\n0000000000 65535 f \n`;
        for (const off of offsets) {
            xref += `${String(off).padStart(10, '0')} 00000 n \n`;
        }

        objects.push(xref + `trailer\n<</Size 6/Root 1 0 R>>\nstartxref\n${xrefOffset}\n%%EOF`);

        const pdfContent = objects.join('\n');

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=BAUET_AdmitCard_${studentIdNumber}.pdf`);

        res.send(Buffer.from(pdfContent, 'binary'));
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
