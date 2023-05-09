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
GET http://localhost:3000/api/retrieveSKU?id=1019688
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
    "id":1019688,
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
    "id":1019688,
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
    "id":1019688,
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
