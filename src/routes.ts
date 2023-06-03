import type { IApiResponseBody } from './utils/misc';
import type { IProductBodyFilter, IInventoryBodyFilter } from './inventory-service';

import express, { Request, Response } from 'express';
import { getPureError, HTTP_STATUS_CODES } from './utils/misc';
import { InventoryServiceCls } from './inventory-service';

const router = express.Router();

router.get('/retrieveSKU', async (req: Request, res: Response) => {
  const id = req.query.sku ? Number(req.query.sku) : 0;
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

router.post('/updateSKU', async (req: Request, res: Response) => {
  const body: IProductBodyFilter = req.body;

  const id = body.sku ? body.sku : 0;
  const quantity = body.quantity ? body.quantity : 0;
  const result: IApiResponseBody = {
    data: null,
    error: null,
  };

  try {
    result.data = await InventoryServiceCls.updateSKU(id, quantity);
  } catch (err) {
    const pureErr = getPureError(err);
    result.error = pureErr;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    console.error(`updateSKU API failed !`, pureErr);
  }

  res.send(result);
});

router.post('/incrementSKU', async (req: Request, res: Response) => {
  const body: IProductBodyFilter = req.body;

  const id = body.sku ? body.sku : 0;
  const quantity = body.quantity ? body.quantity : 0;
  const result: IApiResponseBody = {
    data: null,
    error: null,
  };

  try {
    const isDecrement = false;
    const isReturnProduct = true;
    result.data = await InventoryServiceCls.incrementSKU(id, quantity, isDecrement, isReturnProduct);
  } catch (err) {
    const pureErr = getPureError(err);
    result.error = pureErr;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    console.error(`incrementSKU API failed !`, pureErr);
  }

  res.send(result);
});

router.post('/decrementSKU', async (req: Request, res: Response) => {
  const body: IProductBodyFilter = req.body;

  const id = body.sku ? body.sku : 0;
  const quantity = body.quantity ? body.quantity : 0;
  const result: IApiResponseBody = {
    data: null,
    error: null,
  };

  try {
    result.data = await InventoryServiceCls.decrementSKU(id, quantity);
  } catch (err) {
    const pureErr = getPureError(err);
    result.error = pureErr;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    console.error(`decrementSKU API failed !`, pureErr);
  }

  res.send(result);
});

router.post('/retrieveManySKUs', async (req: Request, res: Response) => {
  const body: IProductBodyFilter[] = req.body;

  const productWithIds = body && body.length ? body : [];
  const result: IApiResponseBody = {
    data: null,
    error: null,
  };

  try {
    result.data = await InventoryServiceCls.retrieveManySKUs(productWithIds);
  } catch (err) {
    const pureErr = getPureError(err);
    result.error = pureErr;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    console.error(`retrieveManySKUs API failed !`, pureErr);
  }

  res.send(result);
});

router.post('/decrementManySKUs', async (req: Request, res: Response) => {
  const body: IProductBodyFilter[] = req.body;

  const productsFilter = body && body.length ? body : [];
  const result: IApiResponseBody = {
    data: null,
    error: null,
  };

  try {
    result.data = await InventoryServiceCls.decrementManySKUs(productsFilter);
  } catch (err) {
    const pureErr = getPureError(err);
    result.error = pureErr;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    console.error(`decrementManySKUs API failed !`, pureErr);
  }

  res.send(result);
});


//#region inventorySearch APIs
router.post('/inventorySearch', async (req: Request, res: Response) => {
  const inventoryFilter: IInventoryBodyFilter = req.body;

  const result: IApiResponseBody = {
    data: null,
    error: null,
  };

  try {
    result.data = await InventoryServiceCls.inventorySearch(inventoryFilter);
  } catch (err) {
    const pureErr = getPureError(err);
    result.error = pureErr;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    console.error(`inventorySearch API failed !`, pureErr);
  }

  res.send(result);
});

router.post('/inventorySearchWithDistance', async (req: Request, res: Response) => {
  const inventoryFilter: IInventoryBodyFilter = req.body;

  const result: IApiResponseBody = {
    data: null,
    error: null,
  };

  try {
    result.data = await InventoryServiceCls.inventorySearchWithDistance(inventoryFilter);
  } catch (err) {
    const pureErr = getPureError(err);
    result.error = pureErr;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    console.error(`inventorySearchWithDistance API failed !`, pureErr);
  }

  res.send(result);
});

//#endregion

export { router };
