## decrementSKU

### Request

```json
POST http://localhost:3000/api/decrementSKU
{
    "sku":1019688,
    "quantity":4
}
```

### Response

```json
{
  "data": {
    "sku": 1019688,
    "name": "5-Year Protection Plan - Geek Squad",
    "type": "BlackTie",
    "totalQuantity": 16 //previous value 20
  },
  "error": null
}
```
