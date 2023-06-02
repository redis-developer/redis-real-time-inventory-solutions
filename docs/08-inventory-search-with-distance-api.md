## inventorySearchWithDistance

### Request

```json
POST http://localhost:3000/api/inventorySearchWithDistance
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
      "sku": "1019688",
      "quantity": "38",
      "distInKm": "107.74513"
    },
    {
      "storeId": "05_NY_WATERTOWN",
      "storeLocation": {
        "longitude": -75.910759,
        "latitude": 43.974785
      },
      "sku": "1019688",
      "quantity": "31",
      "distInKm": "268.86249"
    },
    {
      "storeId": "10_NY_POUGHKEEPSIE",
      "storeLocation": {
        "longitude": -73.923912,
        "latitude": 41.70829
      },
      "sku": "1019688",
      "quantity": "45",
      "distInKm": "427.90787"
    }
  ],
  "error": null
}
```
