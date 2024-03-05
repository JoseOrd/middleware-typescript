import express from 'express';
import { InvokeController } from '../controllers/invokeController';

const router = express.Router();

router.post('/channels/:channelName/chaincodes/:chaincodeName', InvokeController.invokeChaincode);

export default router;