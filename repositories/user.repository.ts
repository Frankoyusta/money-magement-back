import { randomUUID } from 'node:crypto';
import { prisma } from '../database/prisma.config';


export class UserRepository {


    createUser = async (email: string, password: string, name: string) => {
        return await prisma.user.create({
            data: {
                id: randomUUID(),
                password: password,
                name: name,
                email: email,
                role: 'user'
            }
        })
    }


    findUserById = async (id: string) => {
        return await prisma.user.findUnique({
            where: { id }
        })
    }

    findUserByEmail = async (email: string) => {
        return await prisma.user.findUnique({
            where: { email }
        })
    }
}


