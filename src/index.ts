import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';

import { setRedis } from './utils/redis-wrapper';
import { router } from './routes';

dotenv.config();

//--- config
const REDIS_URI = process.env.REDIS_CONNECTION_URI || 'redis://localhost:6379';
const PORT = process.env.PORT || 3000;
const API_PREFIX = '/api';
//--- config ends

const app: Express = express();
app.use(express.json());

app.use(API_PREFIX, router);

app.get('/', (req: Request, res: Response) => {
    res.send('Express Server for ' + API_PREFIX);
});

app.listen(PORT, async () => {
    await setRedis(REDIS_URI);

    console.log(`Server is running at http://localhost:${PORT}`);
});


