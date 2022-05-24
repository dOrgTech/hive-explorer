# ⛓ Hive Explorer

## Description

This is a collaborative research project between Cent.co x dOrg to index NFT movements to try and glean insights as to the nature of these movements. It's our hope that we can learn something interesting about how NFTs trade hands through this on-chain data.

The current tools we are using for are:

* `JSON-RPC` for getting transfer events from an Ethereum node
* `Nest.js` for setting up a pluggable architecture around modules to easily change data sources / output if necessary
* `Docker` for setting up a local postgres database

You can see a live version running at https://hive.cent.co

## Dev Environment
Examples of .env file are can be found in both client and server apps

* root/packages/client/.env.example
* root/packages/server/.env.example

To get the development environment running you will need to create in each directory a `.env.development` file and copy the contents from the examples.
For security reason there are certain variables not included in the example files please contact the dev team @ d0rg.

### Dependencies
* Node 16.14.0
* Yarn 1.22.17
* You need to have [Docker](https://docs.docker.com/get-docker/) installed and running. The postgres db server will run in a container.

### Package Installation
From the root directory of the repository

```bash
$ yarn install
```
Yarn workspaces will handle the installation of dependencies in both server and client applications.
### Running The App
In order to run both the server and client you will need to terminals open, one for each application.
From the root directory of the repository.

### Sever
```bash
# development
$ yarn server:start

# development watch mode
$ yarn server:start:dev

# development watch mode and dump script enabled
$ yarn server:start:dev:dump
```
#### Stopping Postgres Docker Container

```bash
$ yarn server:stop:dev
```

#### Running Tests
```bash
# unit tests
$ yarn server:test

# e2e tests
$ yarn server:test:e2e

# test coverage
$ yarn server:test:cov
```

### Client
```bash
# development
$ yarn client:start

# development watch mode
$ yarn client:start:dev
```

#### Running Tests
```bash
# unit tests
$ yarn client:test
```

## Technical FAQ

### How do I install npm packages ?
This monorepo makes use of yarn workspaces you'll find both server and client applications under the /packages folder
* The client package is named as: "@cent-social-index/client"
* The server package is names as: "@cent-social-index/server"

in order to install a new npm package:
```bash
$ yarn workspace [name-of-package] add [name-of-npm-package]

# for example installing lodash on the client would look like
$ yarn workspace @cent-social-index/client add lodash
```

### How can I manually populate the database instead of running dumps?

First, you'll need to download the db dump from [Google Drive](https://drive.google.com/drive/folders/13e1oLtjr4nUlVz0w-OamFrYipSEXcjfV?usp=sharing)

Once you've got the data file and installed Docker and have the PostgreSQL image running as described above, you'll want to load the data onto the image and persist it to the volume.

*Note that due to the size of the data file, some of these steps might take a while — thus, while developing it might make sense to use a smaller subset of the data.*

1. Run the server at least once (no dump mode) to get the db and table definitions created. They are shown below for informational purposes:

<details>
    <summary>Schema</summary>

```sql
CREATE TABLE transfer_events (
    id                  CHAR(30) PRIMARY KEY,
    chain_id            INT,
    contract_address    CHAR(42),
    from_address        CHAR(42),
    to_address          CHAR(42),
    token_id            NUMERIC(78,0),
    quantity            NUMERIC(78,0),
    txn_id              CHAR(66),
    block_number        INT
);
```

```sql
CREATE TABLE token_balances (
    id                  CHAR(30) PRIMARY KEY,
    chain_id            INT,
    contract_address    CHAR(42),
    owner_address       CHAR(42),
    token_id            NUMERIC(78,0),
    balance             NUMERIC(78,0)
);
```
</details>

2. Connect to the Docker image and restore the dump


`psql -U db_user db_name < dump_name.sql`


Now your database should persist the historical data in the volume! If you want to reset this, follow the below instructions.

### How do start the local database from scratch?


You need to stop the docker container (see above)


* UI: From your docker application dashboard -> volumes, remove cent-social-index_pgdata volume

* Bash:


```bash

$ docker volume rm cent-social-index_pgdata

```
