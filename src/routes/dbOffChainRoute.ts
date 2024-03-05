import express from 'express';
import { DbOffChainController } from '../controllers/dbOffChainController';

const router = express.Router();

router.get('/:hash', DbOffChainController.get);

router.post('/', DbOffChainController.add);

export default router;