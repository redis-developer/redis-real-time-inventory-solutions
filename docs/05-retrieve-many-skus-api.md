## retrieveManySKUs

### Request

```json
POST http://localhost:3000/api/retrieveManySKUs
[{
    "sku":1019688
},{
    "sku":1003622
},{
    "sku":1006702
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
      "totalQuantity": 24
    },
    {
      "sku": 1003622,
      "name": "Aquarius - Fender Stratocaster 1,000-Piece Jigsaw Puzzle - Black/Red/White/Yellow/Green/Orange/Blue",
      "type": "HardGood",
      "totalQuantity": 10
    },
    {
      "sku": 1006702,
      "name": "Clash of the Titans [DVD] [2010]",
      "type": "Movie",
      "totalQuantity": 10
    }
  ],
  "error": null
}
```
