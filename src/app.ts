import dotenv from 'dotenv';
import express from 'express';
import Router from './routes/index';
import { JwtMiddleware } from './middlewares/JwtMIddleware';

const app = express();
dotenv.config();

app.use(express.json({limit: '5mb'}));
app.use(JwtMiddleware);

app.use('/api/v0', Router)

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
