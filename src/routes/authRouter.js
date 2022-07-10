import { Router } from 'express';
import { createAccount, login } from '../controller/auth';

const authRouter = Router();

authRouter.post('/signup', createAccount);
authRouter.post('/login', login);

export { authRouter };
