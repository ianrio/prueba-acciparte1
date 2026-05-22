import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.js';
import { loginHandler, meHandler } from './auth.controller.js';

export const authRouter = Router();

authRouter.post('/login', loginHandler);
authRouter.get('/me', authenticate, meHandler);
