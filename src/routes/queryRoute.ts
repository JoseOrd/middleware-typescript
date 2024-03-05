import express from 'express';
import { QueryController } from '../controllers/queryController';

const router = express.Router();

router.get('/channels/:channelName/chaincodes/:chaincodeName', QueryController.queryChaincode);

export default router;