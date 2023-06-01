interface IStore {
    storeId?: string;
    storeLocation?: {
        latitude?: number;
        longitude?: number;
    },
}

interface IStoresInventory extends IStore {
    sku?: number;
    quantity?: number;
}



export type {
    IStoresInventory,
    IStore
};
