# cent-social-index

## Description
Social indexing of NFTs with Cent



## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## FAQ

### CA certificate error on Anyblock postgres db connection
```
ERROR [TypeOrmModule] Unable to connect to the database. Retrying (1)...
Error: certificate has expired
    at TLSSocket.onConnectSecure (node:_tls_wrap:1530:34)
    at TLSSocket.emit (node:events:520:28)
    at TLSSocket._finishInit (node:_tls_wrap:944:8)
    at TLSWrap.ssl.onhandshakedone (node:_tls_wrap:725:12)

```
- [Node Postgres SSL](https://node-postgres.com/features/ssl)
- [Generate root CA key and certificate](https://www.ibm.com/docs/en/runbook-automation?topic=certificate-generate-root-ca-key)

## Nest Framework
Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).
- Website - [https://nestjs.com](https://nestjs.com/)

Nest is [MIT licensed](LICENSE).

