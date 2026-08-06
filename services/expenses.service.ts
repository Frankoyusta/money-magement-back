import { UpsertExpense } from "../interfaces/upsert-expense.interface";
import { ExpenseRepository } from "../repositories/expense.repository";
import { UserRepository } from "../repositories/user.repository";

const expenseRepository = new ExpenseRepository();
const userRepository = new UserRepository()

export class ExpenseService {
    upsertExpense = async (expense: UpsertExpense) => {
        // Validar que el usuario exista 
        const user = await userRepository.findUserById(expense.userId);
        if (!user) {
            return {
                codeError: 404,
                msg: 'Usuario no existe'
            };
        };

        // En caso de edición se busca el expense y validamos que el userId del expense sea el mismo que el del user
        const expenseFouded = await expenseRepository.findById(expense.id || '')
        if (expenseFouded && expenseFouded.userId !== user.id) {
            return {
                codeError: 401,
                msg: 'No estas habilitado a editar este gasto'
            };
        }

        // Hacer upsert
        await expenseRepository.upsertExpense(expense);

        return {}
    }


    getExpensesByUserId = async (userId: string) => {
        // Validar que el usuario exista 
        const user = await userRepository.findUserById(userId);
        if (!user) {
            return {
                codeError: 404,
                msg: 'Usuario no existe'
            };
        };

        // Traer todos los expenses del usuario
        const expenses = await expenseRepository.findByUserId(userId);


        return {
            expenses
        }
    }

}