import type { IProduct } from './models/product-mdl';
import type { IStoresInventory } from './models/stores-inventory-mdl';

import {
    Entity as RedisEntity
} from "redis-om";

import { getRedisOmClient, getNodeRedisClient, AggregateSteps } from "./utils/redis-wrapper";
import * as ProductRepo from "./models/product-repo";
import * as StoresInventoryRepo from "./models/stores-inventory-repo";

interface IProductBodyFilter {
    sku?: number;
    quantity?: number;
}
interface IInventoryBodyFilter {
    sku?: number;
    searchRadiusInKm?: number;
    userLocation?: {
        latitude?: number;
        longitude?: number;
    }
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
                throw `For product with Id ${_productId},  available quantity(${product.totalQuantity}) is lesser than decrement quantity(${_decrQuantity})`;
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

            const result = await repository.fetch(...idArr);

            let productsArr: IProduct[] = [];

            if (idArr.length == 1) {
                productsArr = [<IProduct>result];
            }
            else {
                productsArr = <IProduct[]>result;
            }

            if (productsArr && productsArr.length) {

                retItems = productsArr.map((product) => {
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
            const promArr: Promise<boolean>[] = [];
            for (let p of _productsFilter) {
                if (p.sku) {
                    const promObj = InventoryServiceCls.validateQuantityOnDecrementSKU(p.sku, p.quantity);
                    promArr.push(promObj)
                }
            }
            await Promise.all(promArr);

            //decrement only
            const promArr2: Promise<IProduct>[] = [];
            for (let p of _productsFilter) {
                if (p.sku && p.quantity) {
                    const isDecrement = true;
                    const isReturnProduct = false;
                    const promObj2 = InventoryServiceCls.incrementSKU(p.sku, p.quantity, isDecrement, isReturnProduct);
                    promArr2.push(promObj2)
                }
            }
            await Promise.all(promArr2);


            //retrieve updated products
            retItems = await InventoryServiceCls.retrieveManySKUs(_productsFilter);
        }
        else {
            throw `Input params failed !`;
        }

        return retItems;
    }

    static async inventorySearch(_inventoryFilter: IInventoryBodyFilter): Promise<IStoresInventory[]> {
        /**  
       Search Product in available stores within search radius.

       :param _inventoryFilter: Product Id, searchRadius and current userLocation 
       :return: Inventory product list 
       */
        const nodeRedisClient = getNodeRedisClient();

        const repository = StoresInventoryRepo.getRepository();
        let retItems: IStoresInventory[] = [];

        if (nodeRedisClient && repository && _inventoryFilter?.sku
            && _inventoryFilter.userLocation?.latitude
            && _inventoryFilter.userLocation?.longitude) {

            const lat = _inventoryFilter.userLocation?.latitude;
            const long = _inventoryFilter.userLocation?.longitude;
            const radiusInKm = _inventoryFilter.searchRadiusInKm || 1000;

            const queryBuilder = repository.search()
                .where('sku')
                .eq(_inventoryFilter.sku)
                .and('quantity')
                .gt(0)
                .and('storeLocation')
                .inRadius((circle) => {
                    return circle
                        .latitude(lat)
                        .longitude(long)
                        .radius(radiusInKm)
                        .kilometers
                });

            console.log(queryBuilder.query);
            // ( ( (@sku:[1019688 1019688]) (@quantity:[(0 +inf]) ) (@storeLocation:[-78.878738 42.88023 500 km]) )

            retItems = <IStoresInventory[]>await queryBuilder.return.all();

            /* RAW QUERY SAMPLE
             FT.SEARCH StoresInventory:index '( ( (@sku:[1019688 1019688]) (@quantity:[(0 +inf]) ) (@storeLocation:[-78.878738 42.88023 500 km]) )' 
            */


            if (!retItems.length) {
                throw `Product not found with in ${radiusInKm}km range!`;
            }
        }
        else {
            throw `Input params failed !`;
        }
        return retItems;
    }

    static async inventorySearchWithDistance(_inventoryFilter: IInventoryBodyFilter): Promise<IStoresInventory[]> {
        /**  
       Search Product in available stores within search radius, Also sort by (store) distance relative to current user location.

       :param _inventoryFilter: Product Id, searchRadius and current userLocation 
       :return: Inventory product list 
       */
        const nodeRedisClient = getNodeRedisClient();

        const repository = StoresInventoryRepo.getRepository();
        let retItems: IStoresInventory[] = [];

        if (nodeRedisClient && repository && _inventoryFilter?.sku
            && _inventoryFilter.userLocation?.latitude
            && _inventoryFilter.userLocation?.longitude) {

            const lat = _inventoryFilter.userLocation?.latitude;
            const long = _inventoryFilter.userLocation?.longitude;
            const radiusInKm = _inventoryFilter.searchRadiusInKm || 1000;

            const queryBuilder = repository.search()
                .where('sku')
                .eq(_inventoryFilter.sku)
                .and('quantity')
                .gt(0)
                .and('storeLocation')
                .inRadius((circle) => {
                    return circle
                        .latitude(lat)
                        .longitude(long)
                        .radius(radiusInKm)
                        .kilometers
                });

            console.log(queryBuilder.query);
            // ( ( (@sku:[1019688 1019688]) (@quantity:[(0 +inf]) ) (@storeLocation:[-78.878738 42.88023 500 km]) )

            const indexName = `${StoresInventoryRepo.STORES_INVENTORY_KEY_PREFIX}:index`;
            const aggregator = await nodeRedisClient.ft.aggregate(
                indexName,
                queryBuilder.query,
                {
                    LOAD: ["@storeId", "@storeLocation", "@sku", "@quantity"],
                    STEPS: [{
                        type: AggregateSteps.APPLY,
                        expression: `geodistance(@storeLocation, ${long}, ${lat})/1000`,
                        AS: 'distInKm'
                    }, {
                        type: AggregateSteps.SORTBY,
                        BY: "@distInKm"
                    }]
                });

            /* RAW QUERY SAMPLE
            FT.AGGREGATE StoresInventory:index '( ( (@sku:[1019688 1019688]) (@quantity:[(0 +inf]) ) (@storeLocation:[-78.878738 42.88023 500 km]) )' LOAD 4 @storeId @storeLocation @sku @quantity  APPLY "geodistance(@storeLocation,-78.878738,42.88043)/1000" AS distInKm SORTBY 2 @distInKm ASC
           */
            retItems = <IStoresInventory[]>aggregator.results;

            if (!retItems.length) {
                throw `Product not found with in ${radiusInKm}km range!`;
            }
            else {
                retItems = retItems.map((item) => {
                    if (typeof item.storeLocation == "string") {
                        const location = item.storeLocation.split(",");
                        item.storeLocation = {
                            longitude: Number(location[0]),
                            latitude: Number(location[1]),
                        }
                    }
                    return item;
                })
            }
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
    IProductBodyFilter,
    IInventoryBodyFilter
}