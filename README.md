# ⛓ Cent.co Social Index

## Description

This is a collaborative research project between Cent.co x dOrg index significant NFT movements (transfers & mints for now) to try and glean insights as to the nature of these movements. It's our hope that we can learn something interesting about how NFTs trade hands through this on-chain data.

The current tools we are using for are:

* `AnyBlock` for SQL queries of on-chain data
* `Nest.js` for setting up a pluggable architecture around modules to easily change data sources / output if necessary
* `SQLite` for hosting the data we're interested in (transfer information) for the initial exploration

## Get Local SQLite DB

### Downloading Corpus Yourself

Honestly, this method is *not* recommended since it takes a very long time to get the entire blockchain information. I would recommend following the full instructions [below](#Syncing-from-Downloaded-Corpus) to instead download the SQLite file which has information up to ~14.45m blocks and syncing the rest locally.

But, if you want to do so, you can skip step #1 below and just start syncing from AnyBlock. You have been warned.

### Syncing from Downloaded Corpus

1. Get the SQLite file from [this link](<INSERT LINK>) and place the it within the directory as `./db/cent.dev.sqlite`

2. You will need an AnyBlock account. Create one [here](https://www.anyblockanalytics.com/).
    * If you have any issues, ping me (Nikhil) with your email and I can add you to my account as a registered user.

3. Next, create an `.env.development` file and use the format specified in `.env.example`, and fill in the fields as specified in AnyBlock.
    * For `DB_PATH` you can do something like `./db/cent.dev.sqlite` — this is the local SQLite database that will get constructed for you.
    * For `ANYBLOCK_DB_DATABASE` we're going to want to query `ethereum_ethereum_mainnet`.

4. Finally, install / run the app as specified [below](#dev-environment) and if all goes well, the app should query AnyBlock to get the data we want and drop it into your local SQLite database in batches with the specified ranges.
    * Once you run `yarn start:dev` to start querying by block range you can stop the sync and it will restart where it left off
    * You can modify the `QUERY_BLOCK_RANGE_SIZE` to be higher or lower and tweak the speed of your sync... For now it's 1000 blocks per query, but that can be modified

## Dev Environment

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

Place technical issues and how to solve them here, as well as things to note when developing / utilizing this repo

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

## Nest Framework

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

* Website - [https://nestjs.com](https://nestjs.com/)

Nest is [MIT licensed](LICENSE).
