import type { IApiResponseBody } from './utils/misc';

import express, { Request, Response } from 'express';
import { getPureError, HTTP_STATUS_CODES } from './utils/misc';
import { InventoryServiceCls } from './inventory-service';

const router = express.Router();

router.get('/retrieveSKU', async (req: Request, res: Response) => {
  const id = req.query.id ? Number(req.query.id) : 0;
  const result: IApiResponseBody = {
    data: null,
    error: null,
  };

  try {
    result.data = await InventoryServiceCls.retrieveSKU(id);
  } catch (err) {
    const pureErr = getPureError(err);
    result.error = pureErr;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    console.error(`retrieveSKU API failed !`, pureErr);
  }

  res.send(result);
});

export { router };
