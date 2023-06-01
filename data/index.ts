import dotenv from 'dotenv';
import fs from 'fs';
import {
    Entity as RedisEntity
} from "redis-om";

import { setRedis } from '../src/utils/redis-wrapper';

import * as ProductRepo from "../src/models/product-repo";
import { IProduct } from '../src/models/product-mdl';

import * as StoresInventoryRepo from "../src/models/stores-inventory-repo";
import { addProductsToStoresInventory, deleteExistingKeys } from './stores-inventory-data';

dotenv.config();

//--- config
const REDIS_URI = process.env.REDIS_CONNECTION_URI || 'redis://localhost:6379';

//page1.json file is taken from RedisMart repo -> data folder 
const pagesArr = ['page1.json'];

const DEFAULT_STOCK_QUANTITY = 10;
//--- config ends


const getProductsFromJSONFiles = async () => {
    const products: any[] = [];
    for (let page of pagesArr) {
        await fs.promises
            .readFile(`./data/${page}`)
            .then((data) => {
                if (data) {
                    const jsonData = JSON.parse(data.toString());
                    if (jsonData?.payload?.blob?.rawBlob) {
                        let rawBlob = JSON.parse(jsonData.payload.blob.rawBlob);
                        if (rawBlob.products) {
                            products.push(...rawBlob.products);
                            console.log(`${rawBlob.products.length} products in ${page}`);
                        }
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return products;
}

const addProducts = async (_products: IProduct[]) => {
    const repository = ProductRepo.getRepository();

    if (repository && _products?.length) {

        await deleteExistingKeys(ProductRepo.PRODUCT_KEY_PREFIX);

        console.log(`adding products...`);
        for (let record of _products) {
            if (record.sku) {
                record.totalQuantity = DEFAULT_STOCK_QUANTITY;
                await repository.save(record.sku.toString(), <RedisEntity>record);
            }

        }
        console.log(`Products added !`);

    }
}



const init = async () => {
    await setRedis(REDIS_URI);

    //----
    const products = await getProductsFromJSONFiles();
    await addProducts(products);
    await ProductRepo.createIndex();
    //----

    await addProductsToStoresInventory(products);
    await StoresInventoryRepo.createIndex();
    //----

    process.exit();
}

init();


