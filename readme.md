## Tech stack

- NodeJS
- Redis

## Seed database

```sh
npm run seed
```

## Start app

```
npm start
```

## API Docs

### retrieveSKU

**Request**

```json
GET http://localhost:3000/api/retrieveSKU?sku=1019688
```

**Response**

```json
{
  "data": {
    "sku": 1019688,
    "name": "5-Year Protection Plan - Geek Squad",
    "type": "BlackTie",
    "totalQuantity": 10
  },
  "error": null
}
```

### updateSKU

**Request**

```json
POST http://localhost:3000/api/updateSKU
{
    "sku":1019688,
    "quantity":25
}
```

**Response**

```json
{
  "data": {
    "sku": 1019688,
    "name": "5-Year Protection Plan - Geek Squad",
    "type": "BlackTie",
    "totalQuantity": 25
  },
  "error": null
}
```

### incrementSKU

**Request**

```json
POST http://localhost:3000/api/incrementSKU
{
    "sku":1019688,
    "quantity":2
}
```

**Response**

```json
{
  "data": {
    "sku": 1019688,
    "name": "5-Year Protection Plan - Geek Squad",
    "type": "BlackTie",
    "totalQuantity": 12
  },
  "error": null
}
```

### decrementSKU

**Request**

```json
POST http://localhost:3000/api/decrementSKU
{
    "sku":1019688,
    "quantity":4
}
```

**Response**

```json
{
  "data": {
    "sku": 1019688,
    "name": "5-Year Protection Plan - Geek Squad",
    "type": "BlackTie",
    "totalQuantity": 16
  },
  "error": null
}
```

### retrieveManySKUs

**Request**

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

**Response**

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
