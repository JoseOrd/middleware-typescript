import { ConnectionManager } from "./connectionManagerService";
import { WalletManager } from "./walletManagerService";

export class QueryService {
    
    static async queryChaincode(
        channelName: string, 
        chaincodeName: string, 
        fcn: string, 
        args: string[], 
        orgName: string, 
        username: string
    ){
        try {            
            const walletManager = new WalletManager(username, orgName);
            const wallet = await walletManager.getWallet();

            const identity = await wallet.get(username);
            if (!identity) {
                throw new Error(`An identity for the user ${username} does not exist in the wallet`);
            }

            const ccp = ConnectionManager.getConnectionProfile(orgName);
            const gateway = await ConnectionManager.createGateway(wallet, username, ccp);

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork(channelName);

            // Get the contract from the network.
            const contract = network.getContract(chaincodeName);

            let result = await contract.evaluateTransaction(fcn, ...args);

            gateway.disconnect();

            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            
            return result.toString();

        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            throw error;   
        }
    }

}