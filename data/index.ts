import dotenv from 'dotenv';
import fs from 'fs';

import { setRedis, getNodeRedisClient } from '../src/utils/redis-wrapper';
import * as ProductRepo from "../src/models/product-repo";

dotenv.config();

//--- config
const REDIS_URI = process.env.REDIS_CONNECTION_URI || 'redis://localhost:6379';

//page1.json file is taken from RedisMart repo -> data folder 
const pagesArr = ['page1.json'];

const defaultStockQuantity = 10;
const keyPrefix = 'ProductEntity';
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

const addProductsToRedis = async (_products) => {
    const repository = ProductRepo.getRepository();
    const nodeRedisClient = getNodeRedisClient();

    if (repository && _products?.length) {

        const existingKeys = await nodeRedisClient?.keys(`${keyPrefix}:*`);
        if (existingKeys?.length) {
            console.log(`deleting existing products`);
            await nodeRedisClient?.del(existingKeys);
        }

        console.log(`adding products to Redis...`);
        for (let record of _products) {
            const entity = repository.createEntity(record);
            entity.totalQuantity = defaultStockQuantity;

            await repository.save(entity);
        }
        console.log(`Products added !`);

    }
}

const init = async () => {
    await setRedis(REDIS_URI);
    await ProductRepo.createIndex();

    const products = await getProductsFromJSONFiles();
    await addProductsToRedis(products);

    process.exit();
}

init();


