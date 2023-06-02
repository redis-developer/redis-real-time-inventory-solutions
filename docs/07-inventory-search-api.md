## inventorySearch

### Request

```json
POST http://localhost:3000/api/inventorySearch
{
    "sku":1019688,
    "searchRadiusInKm":500,
    "userLocation": {
        "latitude": 42.880230,
        "longitude": -78.878738
    }
}
```

### Response

```json
{
  "data": [
    {
      "storeId": "02_NY_ROCHESTER",
      "storeLocation": {
        "longitude": -77.608849,
        "latitude": 43.156578
      },
      "sku": 1019688,
      "quantity": 38
    },
    {
      "storeId": "05_NY_WATERTOWN",
      "storeLocation": {
        "longitude": -75.910759,
        "latitude": 43.974785
      },
      "sku": 1019688,
      "quantity": 31
    },
    {
      "storeId": "10_NY_POUGHKEEPSIE",
      "storeLocation": {
        "longitude": -73.923912,
        "latitude": 41.70829
      },
      "sku": 1019688,
      "quantity": 45
    }
  ],
  "error": null
}
```
