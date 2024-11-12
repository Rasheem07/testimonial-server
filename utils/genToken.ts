import jwt from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from '../lib/config';

export function generateTokens(id: string){

    const data = {
        user: {
            id: id
        }
    }
    const accessToken = jwt.sign(data, JWT_ACCESS_TOKEN, { expiresIn: '11m' });
    const refreshToken = jwt.sign(data , JWT_REFRESH_TOKEN, { expiresIn: '7d' });

    return { accessToken, refreshToken };
};