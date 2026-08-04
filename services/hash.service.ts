import bcrypt from "bcrypt"


export class HashService {

    hash(password: string) {
        const salt = bcrypt.genSaltSync();
        return bcrypt.hashSync(password, salt);
    }

    verify(password: string, hash: string) {
        return bcrypt.compareSync(password, hash);
    }

}