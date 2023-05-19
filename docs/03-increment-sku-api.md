## incrementSKU

### Request

```json
POST http://localhost:3000/api/incrementSKU
{
    "sku":1019688,
    "quantity":2
}
```

### Response

```json
{
  "data": {
    "sku": 1019688,
    "name": "5-Year Protection Plan - Geek Squad",
    "type": "BlackTie",
    "totalQuantity": 12 //previous value 10
  },
  "error": null
}
```
