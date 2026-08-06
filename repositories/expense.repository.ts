import { randomUUID } from 'node:crypto';
import { prisma } from '../database/prisma.config';
import { UpsertExpense } from '../interfaces/upsert-expense.interface';
import { Decimal } from '@prisma/client/runtime/client';



export class ExpenseRepository {
    upsertExpense = async (expense: UpsertExpense) => {
        console.log(expense.description, 'aaa')
        const { id = '' } = expense
        return await prisma.expense.upsert({
            where: {
                id,
                userId: expense.userId
            },
            update: {
                expense: Number(expense.expense),
                date: expense.date,
                description: expense.description

            },
            create: {
                id: randomUUID(),
                expense: Number(expense.expense),
                date: expense.date,
                userId: expense.userId,
                description: expense.description

            }
        })
    }
}