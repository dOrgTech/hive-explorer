# ⛓ Cent.co Social Index

## Description

This is a collaborative research project between Cent.co x dOrg index significant NFT movements (transfers & mints for now) to try and glean insights as to the nature of these movements. It's our hope that we can learn something interesting about how NFTs trade hands through this on-chain data.

The current tools we are using for are:

* `AnyBlock` for SQL queries of on-chain data
* `Nest.js` for setting up a pluggable architecture around modules to easily change data sources / output if necessary
* `Docker` for setting up a local postgres database

## Dev Environment

### Dependencies

* You need to install [Docker](https://docs.docker.com/get-docker/) in order to have local postgres server running locally

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

### How can I load preload the transfer data?

First, you'll need to download the `events.csv` from [dropbox](https://www.dropbox.com/s/k86snoabcto42mf/events.csv?dl=0) which is a 22gb file that has all NFT transfers from the first ever block that ERC-721 tokens existed (around block 4.6m).

Once you've got the data file and installed Docker and have the PostgreSQL image running as described above, you'll want to load the data onto the image and persist it to the volume. 

*Note that due to the size of the data file, some of these steps might take a while — thus, while developing it might make sense to use a smaller subset of the data.*

1. Connect to the Docker image in with your preferred DB client

2. Run the following query to create the table / schema:

```sql
CREATE TABLE events (
    id              INT PRIMARY KEY,
    block_number    INT,
    nft_name        TEXT,
    contract_hash   VARCHAR(66),
    txn_hash        VARCHAR(66),
    txn_type        VARCHAR(10),
    gas             BIGINT,
    value           VARCHAR(78),
    from_hash       VARCHAR(42),
    to_hash         VARCHAR(42),
    token_id        VARCHAR(78),
    timestamp       DATE,
    createdAt       DATE,
    updatedAt       DATE
);
```

3. Then, you'll need to get move the `.csv` file form your host machine to the container.
  
    * You can get the container_id of the container by running `docker ps` on the command line

```bash
$ docker cp /path/events.csv container_id:/events.csv
```

4. Now, populate the Postgres DB by running the following query which copies the `.csv` data into the DB volume

```sql
COPY events(id, block_number, contract_hash, nft_name, txn_hash, txn_type, gas, value, from_hash, to_hash, token_id, timestamp, createdat, updatedat)
FROM '/events.csv'
DELIMITER ','
CSV HEADER;
```

5. Now you can create some indices to speed up querying, e.g.

```sql
CREATE INDEX sender ON events (from_hash);
CREATE INDEX recipient ON events (to_hash);
CREATE INDEX contract ON events (nft_name);
CREATE INDEX members ON events (nft_name, to_hash);
```

6. Check the [`graph-research` repo](https://github.com/cent-inc/graph-research) for a further auxillary table to create (`collection_owner`) which is a user <> collection pair to map a user to a collection regardless of # of NFTs they have in that collection.

Now your database should persist all of the historical data in the volume! If you want to reset this, follow the below instructions.

### How do start the local database from scratch?

You need to stop the docker container (see above)

* UI: From your docker application dashboard -> volumes, remove cent-social-index_pgdata volume
* Bash:

```bash
$ docker volume rm cent-social-index_pgdata
```

### Why 4500000 Block Floor?

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
