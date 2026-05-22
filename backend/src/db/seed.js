import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';

const TENANTS = [
    {
        name: 'Acme',
        slug: 'acme',
        user: { email: 'admin@acme.com', password: 'acme1234', role: 'admin' },
        reports: [
            { firstName: 'Lucía', lastName: 'García López', place: 'Madrid', interventionType: 'medica' },
            { firstName: 'Carlos', lastName: 'Pérez Hernández', place: 'Barcelona', interventionType: 'tecnica' },
        ],
    },
    {
        name: 'Globex',
        slug: 'globex',
        user: { email: 'admin@globex.com', password: 'globex1234', role: 'admin' },
        reports: [
            { firstName: 'Ana', lastName: 'Martín Ruiz', place: 'Sevilla', interventionType: 'rescate' },
            { firstName: 'Javier', lastName: 'Sánchez Romero', place: 'Valencia', interventionType: 'logistica' },
        ],
    },
];

async function seed() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');


        await client.query('TRUNCATE reports, users, tenants RESTART IDENTITY CASCADE');

        for (const t of TENANTS) {
            const { rows: [tenant] } = await client.query(
                `INSERT INTO tenants (name, slug) VALUES ($1, $2) RETURNING id`,
                [t.name, t.slug]
            );

            const passwordHash = await bcrypt.hash(t.user.password, 10);
            const { rows: [user] } = await client.query(
                `INSERT INTO users (tenant_id, email, password_hash, role)
                 VALUES ($1, $2, $3, $4) RETURNING id`,
                [tenant.id, t.user.email, passwordHash, t.user.role]
            );

            for (const r of t.reports) {
                await client.query(
                    `INSERT INTO reports
                       (tenant_id, user_id, first_name, last_name, place, intervention_type)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [tenant.id, user.id, r.firstName, r.lastName, r.place, r.interventionType]
                );
            }

            console.log(`✓ Tenant "${t.name}" creado con usuario ${t.user.email}`);
        }

        await client.query('COMMIT');
        console.log('\nSeed completado.');
        console.log('Credenciales de prueba:');
        TENANTS.forEach(t =>
            console.log(`  ${t.name.padEnd(8)} → ${t.user.email}  /  ${t.user.password}`)
        );
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error en el seed:', err);
        process.exitCode = 1;
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
