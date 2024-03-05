import { Request, Response } from "express";
import { JwtService } from "../services/jwtService";
import { WalletManager } from "../services/walletManagerService";

export class UserController {
    
    static async register(req: Request, res: Response){
        try {        
            const { username, orgName } = req.body;
    
            if (!username || !orgName) {
                return res.status(400).json({ message: 'username and orgName are required' });
            }        
    
            const walletManager = new WalletManager(username, orgName);
            const response = await walletManager.createWallet();
    
            return res.status(200).json(response);
    
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }

    static async login(req: Request, res: Response){
        try {
            const { username, orgName } = req.body;
    
            if (!username || !orgName) {
                res.status(400).json({ message: 'username and orgName are required' });
            }
            
            const walletManager = new WalletManager(username, orgName);
            const wallet = await walletManager.getWallet();
            const exists = await wallet.get(username);
            
            if (!exists) {
                return res.status(404).json({ message: `${username} does not exist in ${orgName}` });
            }
    
            const token = JwtService.generateToken(username, orgName);
    
            return res.status(200).json({
                success: true,
                access_token: token
            });
    
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }
}