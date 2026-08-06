import { Request, Response } from "express";
import { ExpenseService } from "../services/expenses.service";

interface RequestWithUser extends Request {
    uid?: string;
    name?: string;
}

const expenseService = new ExpenseService();


export const getExpensesController = async (req: RequestWithUser, res: Response) => {
    const userId = req.uid
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



export const upsertController = async (req: RequestWithUser, res: Response) => {
    try {
        const userId = req.uid
        if (!userId) {
            return res.status(401).json({
                ok: false,
                msg: 'El id del usuario es requerido'
            })
        }
        const { expense } = req.body
        const response = await expenseService.upsertExpense({ ...expense, userId });
        if (response.codeError) {
            return res.status(response.codeError).json({
                ok: false,
                msg: response.msg
            })
        }
        return res.status(200).json({
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




export const deleteExpenseController = async (req: RequestWithUser, res: Response) => {
    try {
        const userId = req.uid
        const { expenseId } = req.body
        if (!userId) {
            return res.status(401).json({
                ok: false,
                msg: 'El id del usuario es requerido'
            })
        }
        const response = await expenseService.deleteExpenseById(expenseId, userId);
        if (response.codeError) {
            return res.status(response.codeError).json({
                ok: false,
                msg: response.msg
            })
        }
        return res.status(200).json({
            ok: true,
            msg: 'Producto eliminado con exito'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}






