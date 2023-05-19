## updateSKU

### Request

```json
POST http://localhost:3000/api/updateSKU
{
    "sku":1019688,
    "quantity":25
}
```

### Response

```json
{
  "data": {
    "sku": 1019688,
    "name": "5-Year Protection Plan - Geek Squad",
    "type": "BlackTie",
    "totalQuantity": 25 //updated value
  },
  "error": null
}
```
