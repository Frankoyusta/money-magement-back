import { randomUUID } from 'node:crypto';
import { prisma } from '../database/prisma.config';
import { UpsertExpense } from '../interfaces/upsert-expense.interface';
import { Decimal } from '@prisma/client/runtime/client';



export class ExpenseRepository {
    upsertExpense = async (expense: UpsertExpense) => {
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

    findById = async (id: string) => {
        return await prisma.expense.findUnique({
            where: {
                id
            }
        })
    }

    findByUserId = async (userId: string) => {
        return await prisma.expense.findMany({
            where: {
                userId: userId
            }
        })
    }
}