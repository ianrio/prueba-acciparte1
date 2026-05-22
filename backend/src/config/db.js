import pg from 'pg';
import { env } from './env.js';

export const pool = new pg.Pool({
    host:     env.db.host,
    port:     env.db.port,
    database: env.db.database,
    user:     env.db.user,
    password: env.db.password,
    max: 10,
});

pool.on('error', (err) => {
    console.error('Error inesperado en el pool de PostgreSQL:', err);
});

export function query(text, params) {
    return pool.query(text, params);
}
