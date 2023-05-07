import * as ProductRepo from "./models/product-repo";
import { IProduct } from './models/product-mdl';

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

        return retItem;
    }


}

export {
    InventoryServiceCls
}