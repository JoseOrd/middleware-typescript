import express from 'express';
import invokeRoutes from './invokeRoute';
import dbOffChainRoutes from './dbOffChainRoute';
import queryRoutes from './queryRoute';
import userRoutes from './userRoute';

const router = express.Router();

router.get('/ping', (_req, res) => {
    console.log('someone pinged here!!');
    res.send('pong');
});

router.use('/users', userRoutes);
router.use('/db', dbOffChainRoutes);
router.use(invokeRoutes);
router.use(queryRoutes);
router.use(dbOffChainRoutes);

export default router;
  