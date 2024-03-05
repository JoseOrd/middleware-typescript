import { Response } from "express";
import { QueryService } from "../services/queryService";
import { CustomRequest } from "../models/Request.model";


export class QueryController {

    static async queryChaincode(req: CustomRequest, res: Response){
        try {
            const { channelName, chaincodeName } = req.params;
            const { orgName, username  } = req;
            const { fcn, args } = req.body;

            console.log('Querying chaincode:', { channelName, chaincodeName, fcn, args, orgName, username });
            
    
            if (!chaincodeName || !channelName || !fcn || !args) {
                return res.status(400).json({ message: 'channelName, chaincodeName, fcn and args are required' });
            }
    
            const response = await QueryService.queryChaincode(
                channelName, 
                chaincodeName, 
                fcn as string, 
                args as string[], 
                orgName as string, 
                username as string
            );
    
            return res.status(200).json({ result: response });    
    
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
    
}
