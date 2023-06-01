import {
    Schema as RedisSchema
} from "redis-om";

import { getRedisOmClient } from "../utils/redis-wrapper";

const STORES_INVENTORY_KEY_PREFIX = 'StoresInventory';

const schema = new RedisSchema(STORES_INVENTORY_KEY_PREFIX, {
    storeId: { type: "string" },
    storeLocation: { type: "point" }, // lat long
    sku: { type: "number" },
    quantity: { type: "number" },
});

const getRepository = () => {
    const redisOmClient = getRedisOmClient();
    return redisOmClient?.fetchRepository(schema);
};

const createIndex = async () => {
    const repository = getRepository();
    if (repository) {
        await repository.createIndex();
    }
};

export {
    getRepository,
    createIndex,
    STORES_INVENTORY_KEY_PREFIX
};