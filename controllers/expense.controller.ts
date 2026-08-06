import { Request, Response } from "express";
import { ExpenseService } from "../services/expenses.service";

const expenseService = new ExpenseService();

export const upsertController = async (req: Request, res: Response) => {
    try {
        const { expense } = req.body
        const response = await expenseService.upsertExpense(expense);
        return res.status(201).json({
            ok: true,
            msg: 'Prueba creada con exito'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Prueba fallida'
        })
    }
}






