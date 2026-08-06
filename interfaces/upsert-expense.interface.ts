import { Decimal } from "@prisma/client/runtime/client";


export interface UpsertExpense {
    id: string | undefined;
    expense: number;
    date: Date;
    description?: string;
    userId: string;
}
