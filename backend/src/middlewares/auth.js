import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';


export function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = header.slice('Bearer '.length).trim();
    try {
        const payload = jwt.verify(token, env.jwtSecret);
        req.auth = {
            userId:   payload.sub,
            tenantId: payload.tenantId,
            role:     payload.role,
            email:    payload.email,
        };
        return next();
    } catch {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
}
