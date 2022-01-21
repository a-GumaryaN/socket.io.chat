import * as jwt from 'jsonwebtoken';

export interface result{
    error?:string,
    username?:string
}

export const auth = (token, secretKey): result => {
    if (!token) return { error: 'access denied...' };
    try {
        const { exp }: any = jwt.decode(token);

        if (Date.now() > exp * 1000) return { error: 'token is expired...' };

        const userVerified = jwt.verify(token, secretKey);

        const decodedToken: any = jwt.decode(token);

        if (userVerified) return { username: decodedToken._id };

        return { error: 'invalid token...' };


    } catch (err) {
        return { error: 'invalid token...' };
    }
}