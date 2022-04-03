# ⛓ Cent.co Social Index

## Description

This is a collaborative research project between Cent.co x dOrg index significant NFT movements (transfers & mints for now) to try and glean insights as to the nature of these movements. It's our hope that we can learn something interesting about how NFTs trade hands through this on-chain data.

The current tools we are using for are:

* `AnyBlock` for SQL queries of on-chain data
* `Nest.js` for setting up a pluggable architecture around modules to easily change data sources / output if necessary
* `Docker` for setting up a local postgres database

## Dev Environment

### Dependencies
- You need to install [Docker](https://docs.docker.com/get-docker/) in order to have local postgres server running locally

### Package Installation

```bash
$ npm install
```

### Running The App

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev
```

### Stopping Postgres Docker Container

```bash
$ yarn db:dev:stop
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Technical FAQ

### How do start the local database from scratch ?
You need to stop the docker container (see above)
- UI: From your docker application dashboard -> volumes, remove cent-social-index_pgdata volume
- Bash:
```bash
$ docker volume rm cent-social-index_pgdata
```

### Why 5000000 Block Floor?

For now we're only querying data related to `ERC721` and `ERC1155` tokens. The first `ERC721` token according to this query is [CryptoKitties](https://etherscan.io/address/0x06012c8cf97bead5deae237070f9587f8e7a266d), which launched on Nov. 23, 2017

``` SQL
SELECT address, name, created_at
FROM token
WHERE
  (type = 'ERC721' OR type = 'ERC1155') AND
  total_supply > 0
ORDER BY created_at ASC
LIMIT 10
```

From this, we can figure out which blocks were mined on that fateful day, and use a round number around then as our floor:

``` SQL
SELECT *
FROM block
WHERE
  timestamp > '2017-11-23' AND
  timestamp < '2017-11-24'
LIMIT 10
```

This way we can save a lot of time, since we're not checking 5,000,000 blocks (30% of the corpus) that we're sure doesn't have any data we're looking for.

