
interface IProduct {
    sku: number;
    name: string;
    type: string;
    regularPrice: number;
    salePrice: number;
    url: string;
    image: string;

    totalQuantity: number;
}


/** 
const sample = {
        "sku": 1000006,
        "name": "Spy Kids: All the Time in the World [Includes Digital Copy] [Blu-ray] [2011]",
        "type": "Movie",
        "regularPrice": 12.99,
        "salePrice": 12.99,
        "url": "https://api.bestbuy.com/click/-/1000006/pdp",
        "image": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/1000/1000006_sa.jpg",
        "totalQuantity":10
    };
*/

export type {
    IProduct
};

