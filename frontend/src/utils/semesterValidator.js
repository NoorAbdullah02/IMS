/**
 * Semester Validation Utility
 * Provides validation for semester input fields on the frontend
 */

const VALID_SEASONS = ['Spring', 'Fall', 'Summer', 'Winter'];
const SEMESTER_REGEX = /^(Spring|Fall|Summer|Winter) \d{4}$/;

/**
 * Validates a semester string format
 * @param {string} semesterString - The semester to validate (e.g., "Spring 2025")
 * @returns {object} - { valid: boolean, error?: string, formatted?: string }
 */
export const validateSemester = (semesterString) => {
    if (!semesterString || typeof semesterString !== 'string') {
        return { valid: false, error: 'Semester required' };
    }

    const trimmed = semesterString.trim();

    if (!SEMESTER_REGEX.test(trimmed)) {
        return {
            valid: false,
            error: 'Format: "Season Year" (e.g., Spring 2025)'
        };
    }

    return { valid: true, formatted: trimmed };
};

/**
 * Auto-format semester input while typing
 * Helps users enter correct format
 */
export const autoFormatSemester = (input) => {
    let value = input.value.trim();

    // If user typed just numbers, try to help
    if (/^\d{4}$/.test(value)) {
        // Don't auto-complete, just show placeholder
        input.placeholder = "e.g. Spring 2025";
        return;
    }

    // Remove extra spaces
    value = value.replace(/\s+/g, ' ');

    // Capitalize season
    value = value.replace(/^(spring|fall|summer|winter)/, match =>
        match.charAt(0).toUpperCase() + match.slice(1)
    );

    input.value = value;
};

/**
 * Add real-time validation to semester input field
 */
export const attachSemesterValidation = (inputElement) => {
    if (!inputElement) return;

    inputElement.addEventListener('input', () => {
        autoFormatSemester(inputElement);

        const validation = validateSemester(inputElement.value);

        // Remove any previous error styling
        inputElement.classList.remove('border-red-500', 'bg-red-500/5');

        if (inputElement.value.length > 0 && !validation.valid) {
            inputElement.classList.add('border-red-500', 'bg-red-500/5');
            inputElement.title = validation.error;
        } else {
            inputElement.classList.remove('border-red-500', 'bg-red-500/5');
            inputElement.title = '';
        }
    });

    inputElement.addEventListener('blur', () => {
        if (inputElement.value) {
            const validation = validateSemester(inputElement.value);
            if (validation.valid) {
                inputElement.value = validation.formatted;
            }
        }
    });
};

export default {
    validateSemester,
    autoFormatSemester,
    attachSemesterValidation,
    VALID_SEASONS
};
