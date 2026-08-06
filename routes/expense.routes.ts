import { Router } from 'express';
import { upsertController } from '../controllers/expense.controller';
import { check } from 'express-validator';
import { fieldValidator } from '../middlewares/fields-validator';

export const router = Router();



router.use(fieldValidator)

router.post('/upsert', upsertController);



