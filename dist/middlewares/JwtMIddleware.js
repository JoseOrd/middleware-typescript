"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtMiddleware = void 0;
const jwtService_1 = require("../services/jwtService");
const JwtMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const decoded = yield jwtService_1.JwtService.decodeToken(tokenTrimmed);
        if (!decoded || !decoded.username || !decoded.orgName) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.username = decoded.username;
        req.orgName = decoded.orgName;
        next();
    }
    catch (error) {
        console.error("Error in JwtMiddleware:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.JwtMiddleware = JwtMiddleware;
