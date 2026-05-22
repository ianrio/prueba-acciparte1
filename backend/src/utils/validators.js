

export const INTERVENTION_TYPES = ['medica', 'tecnica', 'rescate', 'logistica', 'otra'];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(value, { min = 1, max = Infinity } = {}) {
    if (typeof value !== 'string') return false;
    const trimmed = value.trim();
    return trimmed.length >= min && trimmed.length <= max;
}

export function validateLogin(body = {}) {
    const errors = {};

    if (!isNonEmptyString(body.email) || !EMAIL_REGEX.test(body.email.trim())) {
        errors.email = 'Email no válido';
    }
    if (!isNonEmptyString(body.password, { min: 6 })) {
        errors.password = 'Contraseña obligatoria (mínimo 6 caracteres)';
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
        value: {
            email:    (body.email    || '').trim().toLowerCase(),
            password: body.password || '',
        },
    };
}

export function validateReport(body = {}) {
    const errors = {};

    if (!isNonEmptyString(body.firstName, { min: 2, max: 120 })) {
        errors.firstName = 'Nombre obligatorio (entre 2 y 120 caracteres)';
    }
    if (!isNonEmptyString(body.lastName, { min: 2, max: 180 })) {
        errors.lastName = 'Apellidos obligatorios (entre 2 y 180 caracteres)';
    }
    if (!isNonEmptyString(body.place, { min: 2, max: 200 })) {
        errors.place = 'Lugar obligatorio (entre 2 y 200 caracteres)';
    }
    if (!INTERVENTION_TYPES.includes(body.interventionType)) {
        errors.interventionType = `Tipo de intervención no válido. Valores permitidos: ${INTERVENTION_TYPES.join(', ')}`;
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
        value: {
            firstName:        (body.firstName        || '').trim(),
            lastName:         (body.lastName         || '').trim(),
            place:            (body.place            || '').trim(),
            interventionType: body.interventionType,
        },
    };
}
