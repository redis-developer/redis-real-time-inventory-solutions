import type { IProduct } from './models/product-mdl';
import {
    Entity as RedisEntity
} from "redis-om";

import { getRedisOmClient } from "./utils/redis-wrapper";
import * as ProductRepo from "./models/product-repo";

interface IProductBodyFilter {
    sku?: number;
    quantity?: number;
}

class InventoryServiceCls {


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

    static async incrementSKU(_productId: number, _incrQuantity: number, _isDecrement: boolean, _isReturnProduct: boolean): Promise<IProduct> {
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
        if (_isDecrement) {
            _incrQuantity = _incrQuantity * -1;
        }
        if (redisOmClient && _productId && _incrQuantity) {

            const updateKey = `${ProductRepo.PRODUCT_KEY_PREFIX}:${_productId}`;
            await redisOmClient.redis?.json.numIncrBy(updateKey, '$.totalQuantity', _incrQuantity);

            if (_isReturnProduct) {
                retItem = await InventoryServiceCls.retrieveSKU(_productId);
            }

        }
        else {
            throw `Input params failed !`;
        }

        return retItem;
    }


    static async validateQuantityOnDecrementSKU(_productId: number, _decrQuantity?: number): Promise<boolean> {
        let isValid = false;

        if (!_decrQuantity) {
            _decrQuantity = 1;
        }

        if (_productId) {
            const product = await InventoryServiceCls.retrieveSKU(_productId);
            if (product && product.totalQuantity && product.totalQuantity > 0
                && (product.totalQuantity - _decrQuantity >= 0)) {

                isValid = true;
            }
            else {
                throw `For product with Id ${_productId} - available quantity(${product.totalQuantity}) is lesser than decrement quantity(${_decrQuantity})`;
            }

        }
        return isValid;
    }
    static async decrementSKU(_productId: number, _decrQuantity: number): Promise<IProduct> {
        /**  
        decrement quantity of a Product.

        :param _productId: Product Id
        :param _decrQuantity: new decrement quantity
        :return: Product with Quantity
        */
        let retItem: IProduct = {};

        let isValid = await InventoryServiceCls.validateQuantityOnDecrementSKU(_productId, _decrQuantity);

        if (isValid) {
            const isDecrement = true;
            const isReturnProduct = true;
            retItem = await InventoryServiceCls.incrementSKU(_productId, _decrQuantity, isDecrement, isReturnProduct);
        }

        return retItem;
    }

    static async retrieveManySKUs(_productWithIds: IProductBodyFilter[]): Promise<IProduct[]> {
        /**  
        Get current Quantity of specific Products.

        :param _productWithIds: Product list with Id
        :return: Product list
        */
        const repository = ProductRepo.getRepository();
        let retItems: IProduct[] = [];

        if (repository && _productWithIds && _productWithIds.length) {

            const idArr = _productWithIds.map((product) => {
                return product.sku?.toString() || ""
            });

            const products = <IProduct[]>await repository.fetch(...idArr);

            if (products && products.length) {

                retItems = products.map((product) => {
                    return {
                        sku: product.sku,
                        name: product.name,
                        type: product.type,
                        totalQuantity: product.totalQuantity
                    }
                });
            }
            else {
                throw `No products found !`;
            }
        }
        else {
            throw `Input params failed !`;
        }

        return retItems;
    }

    static async decrementManySKUs(_productsFilter: IProductBodyFilter[]): Promise<IProduct[]> {
        /**  
        decrement quantity  of specific Products.

        :param _productWithIds: Product list with Id
        :return: Product list
        */
        let retItems: IProduct[] = [];

        if (_productsFilter && _productsFilter.length) {
            //validation only
            for (let p of _productsFilter) {
                if (p.sku) {
                    await InventoryServiceCls.validateQuantityOnDecrementSKU(p.sku, p.quantity);
                }
            }

            //decrement only
            for (let p of _productsFilter) {
                if (p.sku && p.quantity) {
                    const isDecrement = true;
                    const isReturnProduct = false;
                    await InventoryServiceCls.incrementSKU(p.sku, p.quantity, isDecrement, isReturnProduct);
                }
            }

            //retrieve updated products
            retItems = await InventoryServiceCls.retrieveManySKUs(_productsFilter);
        }
        else {
            throw `Input params failed !`;
        }

        return retItems;
    }

}

export {
    InventoryServiceCls
}

export type {
    IProductBodyFilter
}