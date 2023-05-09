import {
    Schema as RedisSchema
} from "redis-om";

import { getRedisOmClient } from "../utils/redis-wrapper";

const PRODUCT_KEY_PREFIX = 'Product';

const schema = new RedisSchema(PRODUCT_KEY_PREFIX, {
    sku: { type: "number" },
    name: { type: "string" },
    type: { type: "string" },
    regularPrice: { type: "number" },
    salePrice: { type: "number" },
    url: { type: "string" },
    image: { type: "string" },

    totalQuantity: { type: "number" }
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
    PRODUCT_KEY_PREFIX
};