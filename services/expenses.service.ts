import { UpsertExpense } from "../interfaces/upsert-expense.interface";
import { ExpenseRepository } from "../repositories/expense.repository";

const expenseRepository = new ExpenseRepository();

export class ExpenseService {


    upsertExpense = async (expense: UpsertExpense) => {
        const a = await expenseRepository.upsertExpense(expense);
        console.log(a)
        return true
    }

}