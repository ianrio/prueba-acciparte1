import { query } from '../../config/db.js';
import { HttpError } from '../../middlewares/errorHandler.js';

export async function listByTenant(tenantId) {
    const { rows } = await query(
        `SELECT r.id, r.first_name, r.last_name, r.place,
                r.intervention_type,
                u.email AS created_by_email
           FROM reports r
           JOIN users u ON u.id = r.user_id
          WHERE r.tenant_id = $1
          ORDER BY r.id`,
        [tenantId]
    );

    return rows.map(serialize);
}

export async function getByIdForTenant(tenantId, reportId) {
    const { rows } = await query(
        `SELECT r.id, r.first_name, r.last_name, r.place,
                r.intervention_type,
                u.email AS created_by_email
           FROM reports r
           JOIN users u ON u.id = r.user_id
          WHERE r.tenant_id = $1 AND r.id = $2
          LIMIT 1`,
        [tenantId, reportId]
    );

    if (rows.length === 0) {

        throw new HttpError(404, 'Informe no encontrado');
    }
    return serialize(rows[0]);
}

export async function createForTenant(tenantId, userId, data) {
    const { rows } = await query(
        `INSERT INTO reports
           (tenant_id, user_id, first_name, last_name, place, intervention_type)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, first_name, last_name, place, intervention_type`,
        [tenantId, userId, data.firstName, data.lastName, data.place, data.interventionType]
    );

    return serialize(rows[0]);
}

function serialize(row) {
    const result = {
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        place: row.place,
        interventionType: row.intervention_type,
    };
    if (row.created_by_email) {
        result.createdByEmail = row.created_by_email;
    }
    return result;
}
