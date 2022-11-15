# PolkaStats for Subsocial

[PolkaStats](https://polkastats.io) block explorer for [Subsocial](https://subsocial.network/), an open platform for decentralized social networks and marketplaces.

This repository is ARCHIVED, for latest version go to https://github.com/polkastats/polkastats

## Install

Install mono-repo:

```
git clone https://github.com/Colm3na/polkastats-subsocial.git
cd polkastats-subsocial
yarn
```

### Frontend

You will need `nodejs`:

```
yarn workspace frontend dev
```

That will start a dev frontend with hot reload. 

### Backend

You will need `nodejs`, `docker` and `docker-compose`:

```
yarn workspace backend docker
```

That will build and start all the required dockers automagically:

- PostgreSQL
- Hasura GraphQL server
- Parity Polkadot client
- Nodejs crawler
