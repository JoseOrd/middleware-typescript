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
exports.UserController = void 0;
const jwtService_1 = require("../services/jwtService");
const walletManagerService_1 = require("../services/walletManagerService");
class UserController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, orgName } = req.body;
                if (!username || !orgName) {
                    return res.status(400).json({ message: 'username and orgName are required' });
                }
                const walletManager = new walletManagerService_1.WalletManager(username, orgName);
                const response = yield walletManager.createWallet();
                return res.status(200).json(response);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, orgName } = req.body;
                if (!username || !orgName) {
                    res.status(400).json({ message: 'username and orgName are required' });
                }
                const walletManager = new walletManagerService_1.WalletManager(username, orgName);
                const wallet = yield walletManager.getWallet();
                const exists = yield wallet.get(username);
                if (!exists) {
                    return res.status(404).json({ message: `${username} does not exist in ${orgName}` });
                }
                const token = jwtService_1.JwtService.generateToken(username, orgName);
                return res.status(200).json({
                    success: true,
                    access_token: token
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.UserController = UserController;
