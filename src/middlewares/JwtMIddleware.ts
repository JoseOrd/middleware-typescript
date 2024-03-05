import { NextFunction, Response } from "express";
import { JwtService } from "../services/jwtService";
import { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "../models/Request.model";


export const JwtMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        console.log(`New request on ${req.originalUrl}`);
        
        if (req.originalUrl.includes('/users') || req.originalUrl.includes('/register')) {
            return next();
        }

        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        const tokenTrimmed = token.split('Bearer ')[1].trim() || '';
        const decoded: JwtPayload = await JwtService.decodeToken(tokenTrimmed);

        if (!decoded || !decoded.username || !decoded.orgName) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.username = decoded.username;
        req.orgName = decoded.orgName;

        next();

    } catch (error) {
        console.error("Error in JwtMiddleware:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
} 
