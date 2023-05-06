import type { IProduct } from "./product-mdl";
import {
    Entity as RedisEntity,
    Schema as RedisSchema
} from "redis-om";

import { getRedisOmClient } from "../utils/redis-wrapper";

//for typescript
interface ProductEntity extends IProduct {
}

//for redis
class ProductEntity extends RedisEntity {
}

//for redis
const schema = new RedisSchema(ProductEntity, {
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
    createIndex
};