import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.js';
import { createReport, getReport, listReports } from './reports.controller.js';

export const reportsRouter = Router();


reportsRouter.use(authenticate);

reportsRouter.get('/',     listReports);
reportsRouter.get('/:id',  getReport);
reportsRouter.post('/',    createReport);
