# Take-home task xim-inc

Rest api design w/ express.js.

## Design doc

Design a service with REST API.
- Authorization via Bearer token (/info, /latency, /logout, /file(все роуты) );
- Setup CORS for any domain;
- DB – Mysql;
- Generate access token on each authorization, valid for 10 minutes. Refresh it after expiration using refresh token;
- Develop using express js framework;
- API:
    - /signin [POST] - get bearer token by id and password;
    - /signin/new_token [POST] - refresh bearer token via refresh token;
    - /signup [POST] - register a new user;
    - Fields id and password, id is either phone number or email;
    - /file/upload [POST] - upload new file to the system and write file parameters to the database: name, extension, MIME type, size, upload date;
    - /file/list [GET] lists files and their parameters from the database using pagination with the page size specified in the list_size parameter passed, by default 10 records per page if the parameter is empty. The page number is specified in the page parameter, by default 1 if not specified;
    - /file/delete/:id [DELETE] - deletes the document from the database and local storage;
    - /file/:id [GET] - show information about the selected file;
    - /file/download/:id [GET] - download a specific file;
    - /file/update/:id [PUT] - update the current document to a new one in the database and local storage;
- In case of successful registration, return a pair of bearer token and refresh token;
    - /inf  - [GET] - returns user id;
    - /logout [GET] - logs out of the system;
- After logout, you need to get a new token;
- Old tokens should not be valid;

## Run locally

1. Install dependencies using pnpm:

```sh
pnpm install
```

2. Copy `.env.example` to `.env` and update the variables if needed:

```sh
cp .env.example .env
```

3. Spin up a local database using Docker, and wait until it's ready (this may take a minute):

```sh
docker-compose -f docker-compose-dev.yaml up -d
```

4. Push the Prisma schema to your database:

```sh
pnpm db:push
```

5. Start the development server:

```sh
pnpm dev
```
