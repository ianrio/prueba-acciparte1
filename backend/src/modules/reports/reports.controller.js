import { validateReport } from '../../utils/validators.js';
import * as reportsService from './reports.service.js';

export async function listReports(req, res, next) {
    try {
        const reports = await reportsService.listByTenant(req.auth.tenantId);
        res.json({ reports });
    } catch (err) {
        next(err);
    }
}

export async function getReport(req, res, next) {
    try {
        const report = await reportsService.getByIdForTenant(
            req.auth.tenantId,
            req.params.id
        );
        res.json(report);
    } catch (err) {
        next(err);
    }
}

export async function createReport(req, res, next) {
    try {
        const { valid, errors, value } = validateReport(req.body);
        if (!valid) {
            return res.status(400).json({ error: 'Datos no válidos', details: errors });
        }


        const report = await reportsService.createForTenant(
            req.auth.tenantId,
            req.auth.userId,
            value
        );

        res.status(201).json(report);
    } catch (err) {
        next(err);
    }
}
