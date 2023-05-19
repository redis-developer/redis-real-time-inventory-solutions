## decrementManySKUs

### Request

```json
POST http://localhost:3000/api/decrementManySKUs
[{
    "sku":1019688,
    "quantity":4
},{
    "sku":1003622,
     "quantity":2
},{
    "sku":1006702,
    "quantity":2
}]
```

### Response

```json
{
  "data": [
    {
      "sku": 1019688,
      "name": "5-Year Protection Plan - Geek Squad",
      "type": "BlackTie",
      "totalQuantity": 28 //previous value 32
    },
    {
      "sku": 1003622,
      "name": "Aquarius - Fender Stratocaster 1,000-Piece Jigsaw Puzzle - Black/Red/White/Yellow/Green/Orange/Blue",
      "type": "HardGood",
      "totalQuantity": 8 //previous value 10
    },
    {
      "sku": 1006702,
      "name": "Clash of the Titans [DVD] [2010]",
      "type": "Movie",
      "totalQuantity": 8 //previous value 10
    }
  ],
  "error": null
}
```
