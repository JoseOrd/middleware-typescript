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
exports.InvokeService = void 0;
const connectionManagerService_1 = require("./connectionManagerService");
const walletManagerService_1 = require("./walletManagerService");
class InvokeService {
    static invokeChaincode(channelName, chaincodeName, fcn, args, orgName, username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const walletManager = new walletManagerService_1.WalletManager(username, orgName);
                const wallet = yield walletManager.getWallet();
                const identity = yield wallet.get(username);
                if (!identity) {
                    throw new Error(`An identity for the user ${username} does not exist in the wallet`);
                }
                const ccp = connectionManagerService_1.ConnectionManager.getConnectionProfile(orgName);
                const gateway = yield connectionManagerService_1.ConnectionManager.createGateway(wallet, username, ccp);
                // Get the network (channel) our contract is deployed to.
                const network = yield gateway.getNetwork(channelName);
                // Get the contract from the network.
                const contract = network.getContract(chaincodeName);
                let result = yield contract.submitTransaction(fcn, ...args);
                gateway.disconnect();
                console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
                return result.toString() === '' ? 'Transaction has been submitted' : result.toString();
            }
            catch (error) {
                console.error(`Failed to submit transaction: ${error}`);
                throw error;
            }
        });
    }
}
exports.InvokeService = InvokeService;
