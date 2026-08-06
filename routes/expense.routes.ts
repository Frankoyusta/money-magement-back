import { Router } from 'express';
import { deleteExpenseController, getExpensesController, upsertController } from '../controllers/expense.controller';
import { check } from 'express-validator';
import { fieldValidator } from '../middlewares/fields-validator';
import { isValidIsoDateTime } from '../helpers/isDateISO-8601';

export const router = Router();




router.get('/', getExpensesController)


router.post('/upsert',
    [
        // Middlewares
        check('expense', 'El campo expense es obligatorio').not().isEmpty(),
        check('expense.date', 'El campo date debe ser una fecha valido en ISO 8601 (YYYY-MM-DDThh:mm:ssZ)').custom(isValidIsoDateTime),
        check('expense.userId', 'El campo userID es obligatorio').not().isEmpty(),
        check('expense.userId', 'El campo userID debe ser un UUID valido').isUUID(),
        fieldValidator

    ]
    , upsertController);


router.delete('/',
    [
        // Middlewares
        check('expenseId', 'El campo expenseID es obligatorio').not().isEmpty(),
        check('userId', 'El campo expenseID es obligatorio').not().isEmpty(),
        fieldValidator

    ]
    , deleteExpenseController);

