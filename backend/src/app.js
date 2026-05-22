import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { reportsRouter } from './modules/reports/reports.routes.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { INTERVENTION_TYPES } from './utils/validators.js';

export function createApp() {
    const app = express();

    app.use(cors({ origin: env.corsOrigin }));
    app.use(express.json({ limit: '100kb' }));

    app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

    app.get('/api/intervention-types', (_req, res) => {
        res.json({
            types: INTERVENTION_TYPES.map(value => ({
                value,
                label: LABELS[value],
            })),
        });
    });

    app.use('/api/auth',    authRouter);
    app.use('/api/reports', reportsRouter);

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}

const LABELS = {
    medica:    'Médica',
    tecnica:   'Técnica',
    rescate:   'Rescate',
    logistica: 'Logística',
    otra:      'Otra',
};
