import { Response } from "express";
import { CustomRequest } from "../models/Request.model";
import { InvokeService } from "../services/invokeService";

export class InvokeController {

    static async invokeChaincode(req: CustomRequest, res: Response){
        try {
            const { channelName, chaincodeName } = req.params;
            const { orgName, username  } = req;
            const { fcn, args } = req.body;

            console.log('Invoke chaincode:', { channelName, chaincodeName, fcn, args, orgName, username });

            if (!chaincodeName || !channelName || !fcn || !args) {
                return res.status(400).json({ message: 'channelName, chaincodeName, fcn and args are required' });
            }

            const response = await InvokeService.invokeChaincode(
                channelName, 
                chaincodeName, 
                fcn as string, 
                args as string[], 
                orgName as string, 
                username as string
            );
    
            return res.status(200).json({ result: response });    

        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ message: error.message });
        }
    }

}