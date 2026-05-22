import { validateLogin } from '../../utils/validators.js';
import * as authService from './auth.service.js';

export async function loginHandler(req, res, next) {
    try {
        const { valid, errors, value } = validateLogin(req.body);
        if (!valid) {
            return res.status(400).json({ error: 'Datos no válidos', details: errors });
        }

        const result = await authService.login(value.email, value.password);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function meHandler(req, res, next) {
    try {
        const profile = await authService.getProfile(req.auth.userId);
        res.json(profile);
    } catch (err) {
        next(err);
    }
}
