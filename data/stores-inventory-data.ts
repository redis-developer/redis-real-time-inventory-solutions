import {
    Entity as RedisEntity
} from "redis-om";
import { getNodeRedisClient } from '../src/utils/redis-wrapper';

import { IProduct } from '../src/models/product-mdl';

import * as StoresInventoryRepo from "../src/models/stores-inventory-repo";
import { IStoresInventory, IStore } from '../src/models/stores-inventory-mdl';

//--- config
const MAX_PRODUCT_QUANTITY = 100;
const MAX_PRODUCT_IN_STORES_COUNT = 3;
//--- config ends

const getStoreDetails = (): IStore[] => {
    //consider following sample stores in NewYork state (USA)

    const stores = [{
        storeId: '01_NY_BUFFALO',
        storeLocation: {
            latitude: 42.880230,
            longitude: -78.878738,
        }
    },
    {
        storeId: '02_NY_ROCHESTER',
        storeLocation: {
            latitude: 43.156578,
            longitude: -77.608849,
        }
    },
    {
        storeId: '03_NY_BINGHAMTON',
        storeLocation: {
            latitude: 42.098701,
            longitude: -75.912537,
        }
    },
    {
        storeId: '04_NY_SYRACUSE',
        storeLocation: {
            latitude: 43.088947,
            longitude: -76.154480,
        }
    },
    {
        storeId: '05_NY_WATERTOWN',
        storeLocation: {
            latitude: 43.974785,
            longitude: -75.910759,
        }
    },
    {
        storeId: '06_NY_UTICA',
        storeLocation: {
            latitude: 43.107204,
            longitude: -75.252312,
        }
    },
    {
        storeId: '07_NY_ALBANY',
        storeLocation: {
            latitude: 42.652580,
            longitude: -73.756233,
        }
    },
    {
        storeId: '08_NY_PLATTSBURGH',
        storeLocation: {
            latitude: 44.699764,
            longitude: -73.471428,
        }
    },
    {
        storeId: '09_NY_NEW_YORK_CITY',
        storeLocation: {
            latitude: 40.730610,
            longitude: -73.935242,
        }
    },
    {
        storeId: '10_NY_POUGHKEEPSIE',
        storeLocation: {
            latitude: 41.708290,
            longitude: -73.923912,
        }
    },
    {
        storeId: '11_NY_MELVILLE',
        storeLocation: {
            latitude: 40.79343,
            longitude: -73.41512,
        }
    }];

    return stores;
}

const deleteExistingKeys = async (_keyPrefix: string) => {
    const nodeRedisClient = getNodeRedisClient();

    if (_keyPrefix) {
        const existingKeys = await nodeRedisClient?.keys(`${_keyPrefix}:*`);
        if (existingKeys?.length) {
            console.log(`deleting existing ${_keyPrefix} and index`);
            await nodeRedisClient?.del(existingKeys);
        }
    }
}

const getRandomIndex = (_max: number) => {
    return Math.floor(Math.random() * _max);
}

const addProductToRandomStore = async (_product: IProduct, _stores: IStore[]) => {
    const repository = StoresInventoryRepo.getRepository();

    if (repository && _product && _stores?.length) {
        const randomStoreIndex = getRandomIndex(_stores.length);
        const randomStore = _stores[randomStoreIndex];
        const randomQuantity = getRandomIndex(MAX_PRODUCT_QUANTITY);

        const storesInventory: IStoresInventory = {
            storeId: randomStore.storeId,
            storeLocation: randomStore.storeLocation,
            sku: _product.sku,
            quantity: randomQuantity
        }
        const id = randomStore.storeId + "_" + _product.sku;
        await repository.save(id, <RedisEntity>storesInventory);
    }
}

const addProductsToStoresInventory = async (_products: IProduct[]) => {
    const stores = getStoreDetails();

    if (_products?.length) {

        await deleteExistingKeys(StoresInventoryRepo.STORES_INVENTORY_KEY_PREFIX);

        console.log(`adding products to Stores Inventory...`);

        for (let prod of _products) {
            let count = 0;
            while (count < MAX_PRODUCT_IN_STORES_COUNT) {//say, add every product to "max" 3 random stores
                await addProductToRandomStore(prod, stores);
                count++;
            }
        }
        console.log(`Products added to Stores Inventory!`);

    }

}

export {
    addProductsToStoresInventory,
    deleteExistingKeys
}