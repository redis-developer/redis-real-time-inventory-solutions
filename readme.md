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

## Response

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
