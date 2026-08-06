import { Request, Response } from "express";
import { ExpenseService } from "../services/expenses.service";

const expenseService = new ExpenseService();


export const getExpensesController = async (req: Request, res: Response) => {
    const { userId } = req.query
    console.log(JSON.stringify(userId))
    if (!userId) {
        return res.status(401).json({
            ok: false,
            msg: 'El id del usuario es requerido'
        })
    }
    const response = await expenseService.getExpensesByUserId(userId.toString())
    if (response.codeError) {
        return res.status(response.codeError).json({
            ok: false,
            msg: response.msg
        })
    }
    return res.status(200).json({
        ok: true,
        expenses: response.expenses
    })
}



export const upsertController = async (req: Request, res: Response) => {
    try {
        const { expense } = req.body
        const response = await expenseService.upsertExpense(expense);
        if (response.codeError) {
            return res.status(response.codeError).json({
                ok: false,
                msg: response.msg
            })
        }
        return res.status(201).json({
            ok: true,
            msg: 'Producto creado o editado con exito'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}






