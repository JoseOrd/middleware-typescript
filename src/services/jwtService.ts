import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';

dotenv.config();

export class JwtService {

    static generateToken(username: string, orgName: string): string {        
        return jwt.sign({
            username,
            orgName
        }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRATION_TIME as string});
    }

    static async decodeToken(token: string) {
        return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    }

}