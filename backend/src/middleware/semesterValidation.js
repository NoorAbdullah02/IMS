/**
 * Semester Validation Middleware
 * Ensures semester strings are in the correct format: "Season YYYY"
 * Prevents malformed years like "202025" from being stored
 */

const VALID_SEASONS = ['Spring', 'Fall', 'Summer', 'Winter'];
const YEAR_REGEX = /^\d{4}$/;  // Exactly 4 digits
const SEMESTER_REGEX = /^(Spring|Fall|Summer|Winter) \d{4}$/;

export const validateSemesterFormat = (semesterString) => {
    if (!semesterString || typeof semesterString !== 'string') {
        return { valid: false, error: 'Semester must be a non-empty string' };
    }

    const trimmed = semesterString.trim();

    // Check exact format: "Season YYYY"
    if (!SEMESTER_REGEX.test(trimmed)) {
        return {
            valid: false,
            error: `Invalid format. Expected "Season YYYY" (e.g., "Spring 2025"), got: "${trimmed}"`
        };
    }

    const [season, year] = trimmed.split(' ');

    // Verify season is valid
    if (!VALID_SEASONS.includes(season)) {
        return {
            valid: false,
            error: `Invalid season: "${season}". Must be one of: ${VALID_SEASONS.join(', ')}`
        };
    }

    // Verify year is exactly 4 digits
    if (!YEAR_REGEX.test(year)) {
        return {
            valid: false,
            error: `Invalid year: "${year}". Must be 4 digits (e.g., 2025)`
        };
    }

    // Check for doubled years like "202025"
    if (year.length > 4 || /([0-9])\1/.test(year)) {
        return {
            valid: false,
            error: `Year appears to be malformed: "${year}". Should be exactly 4 digits.`
        };
    }

    return { valid: true, formatted: trimmed };
};

/**
 * Express middleware to validate semester in request body
 */
export const semesterValidationMiddleware = (req, res, next) => {
    if (req.body && req.body.semester) {
        const validation = validateSemesterFormat(req.body.semester);
        if (!validation.valid) {
            return res.status(400).json({
                message: validation.error,
                received: req.body.semester
            });
        }
        // Replace with formatted version
        req.body.semester = validation.formatted;
    }

    // Also check query parameters
    if (req.query && req.query.semester) {
        const validation = validateSemesterFormat(req.query.semester);
        if (!validation.valid) {
            return res.status(400).json({
                message: validation.error,
                received: req.query.semester
            });
        }
        req.query.semester = validation.formatted;
    }

    next();
};

export default semesterValidationMiddleware;
