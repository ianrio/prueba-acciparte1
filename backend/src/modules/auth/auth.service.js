import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../../config/db.js';
import { env } from '../../config/env.js';
import { HttpError } from '../../middlewares/errorHandler.js';


export async function login(email, password) {
    const { rows } = await query(
        `SELECT u.id, u.email, u.password_hash, u.role, u.tenant_id,
                t.name AS tenant_name, t.slug AS tenant_slug
           FROM users u
           JOIN tenants t ON t.id = u.tenant_id
          WHERE u.email = $1
          LIMIT 1`,
        [email]
    );

    const user = rows[0];
    if (!user) {
        throw new HttpError(401, 'Credenciales no válidas');
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
        throw new HttpError(401, 'Credenciales no válidas');
    }

    const token = jwt.sign(
        {
            sub: user.id,
            tenantId: user.tenant_id,
            role: user.role,
            email: user.email,
        },
        env.jwtSecret,
        { expiresIn: env.jwtExpiresIn }
    );

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        tenant: {
            id: user.tenant_id,
            name: user.tenant_name,
            slug: user.tenant_slug,
        },
    };
}


export async function getProfile(userId) {
    const { rows } = await query(
        `SELECT u.id, u.email, u.role,
                t.id AS tenant_id, t.name AS tenant_name, t.slug AS tenant_slug
           FROM users u
           JOIN tenants t ON t.id = u.tenant_id
          WHERE u.id = $1
          LIMIT 1`,
        [userId]
    );

    if (rows.length === 0) {
        throw new HttpError(404, 'Usuario no encontrado');
    }

    const u = rows[0];
    return {
        user: { id: u.id, email: u.email, role: u.role },
        tenant: { id: u.tenant_id, name: u.tenant_name, slug: u.tenant_slug },
    };
}
