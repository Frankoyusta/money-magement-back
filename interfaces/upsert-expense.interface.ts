import { Decimal } from "@prisma/client/runtime/client";


export interface UpsertExpense {
    id: string | undefined;
    expense: Float16Array;
    date: Date;
    description?: string;
    userId: string;
}
