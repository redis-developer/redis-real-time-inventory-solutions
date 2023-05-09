import type { IProduct } from './models/product-mdl';
import {
    Entity as RedisEntity
} from "redis-om";

import { getRedisOmClient } from "./utils/redis-wrapper";
import * as ProductRepo from "./models/product-repo";

class InventoryServiceCls {

    //TODO : update stream

    static async retrieveSKU(_productId: number): Promise<IProduct> {
        /**  
        Get current Quantity of a Product.

        :param _productId: Product Id
        :return: Product with Quantity
        */
        const repository = ProductRepo.getRepository();
        let retItem: IProduct = {};

        if (repository && _productId) {
            const product = <IProduct>await repository.fetch(_productId.toString());

            if (product) {
                retItem = {
                    sku: product.sku,
                    name: product.name,
                    type: product.type,
                    totalQuantity: product.totalQuantity
                }
            }
            else {
                throw `Product with Id ${_productId} not found`;
            }
        }
        else {
            throw `Input params failed !`;
        }

        return retItem;
    }

    static async updateSKU(_productId: number, _quantity: number): Promise<IProduct> {
        /**  
        Set Quantity of a Product.

        :param _productId: Product Id
        :param _quantity: new quantity
        :return: Product with Quantity
        */
        const repository = ProductRepo.getRepository();
        let retItem: IProduct = {};

        if (repository && _productId && _quantity >= 0) {
            const product = <IProduct>await repository.fetch(_productId.toString());

            if (product) {
                product.totalQuantity = _quantity;

                const savedItem = <IProduct>await repository.save(<RedisEntity>product);

                retItem = {
                    sku: savedItem.sku,
                    name: savedItem.name,
                    type: savedItem.type,
                    totalQuantity: savedItem.totalQuantity
                }
            }
            else {
                throw `Product with Id ${_productId} not found`;
            }
        }
        else {
            throw `Input params failed !`;
        }

        return retItem;
    }

    static async incrementSKU(_productId: number, _incrQuantity?: number): Promise<IProduct> {
        /**  
        increment quantity of a Product.

        :param _productId: Product Id
        :param _incrQuantity: new increment quantity
        :return: Product with Quantity
        */

        const redisOmClient = getRedisOmClient();
        let retItem: IProduct = {};

        if (!_incrQuantity) {
            _incrQuantity = 1;
        }

        if (redisOmClient && _productId && _incrQuantity) {

            const updateKey = `${ProductRepo.PRODUCT_KEY_PREFIX}:${_productId}`;
            await redisOmClient.redis?.json.numIncrBy(updateKey, '$.totalQuantity', _incrQuantity);

            retItem = await InventoryServiceCls.retrieveSKU(_productId);
        }
        else {
            throw `Input params failed !`;
        }

        return retItem;
    }

    static async decrementSKU(_productId: number, _decrQuantity?: number): Promise<IProduct> {
        /**  
        decrement quantity of a Product.

        :param _productId: Product Id
        :param _decrQuantity: new decrement quantity
        :return: Product with Quantity
        */
        let retItem: IProduct = {};

        if (!_decrQuantity) {
            _decrQuantity = -1;
        }
        else {
            _decrQuantity = _decrQuantity * -1;
        }

        const product = await InventoryServiceCls.retrieveSKU(_productId);

        if (product && product.totalQuantity && product.totalQuantity > 0
            && (product.totalQuantity + _decrQuantity >= 0)) {

            retItem = await InventoryServiceCls.incrementSKU(_productId, _decrQuantity);
        }
        else {
            throw `Product with Id ${_productId} - available quantity is lesser than decrement value`;
        }

        return retItem;
    }

}

export {
    InventoryServiceCls
}