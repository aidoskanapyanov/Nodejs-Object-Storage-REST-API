# Nodejs-Object-Storage-REST-API

Rest api design w/ express.js.

## Design doc

Design a service with REST API.

- [x] Authorization via Bearer token (/info, /logout, /file(all routes) );
- [x] Setup CORS for any domain;
- [x] DB – Mysql;
- [x] Generate access token on each authorization, valid for 10 minutes. Refresh it after expiration using refresh token;
- [x] Develop using express js framework;
- [x] API:
  - [x] /signin [POST] - get bearer token by id and password;
  - [x] /signin/new_token [POST] - refresh bearer token via refresh token;
  - [x] /signup [POST] - register a new user;
  - [x] Fields id and password, id is either phone number or email;
  - [x] /file/upload [POST] - upload new file to the system and write file parameters to the database: name, extension, MIME type, size, upload date;
  - [x] /file/list [GET] lists files and their parameters from the database using pagination with the page size specified in the list_size parameter passed, by default 10 records per page if the parameter is empty. The page number is specified in the page parameter, by default 1 if not specified;
  - [x] /file/delete/:id [DELETE] - deletes the document from the database and local storage;
  - [x] /file/:id [GET] - show information about the selected file;
  - [x] /file/download/:id [GET] - download a specific file;
  - [x] /file/update/:id [PUT] - update the current document to a new one in the database and local storage;
- [x] In case of successful registration, return a pair of bearer token and refresh token;
  - [x] /info - [GET] - returns user id;
  - [x] /logout [GET] - logs out of the system;
- [x] After logout, you need to get a new token;
- [x] Old tokens should not be valid;

## Features and Notes

- Refresh token is stored as a safe, http, same-site cookie to prevent XSS and CSRF attacks.
- Invalidated tokens are stored in a MySQL table, and are checked against on every request. It might be better to use a Redis cache for this, but I wanted to keep the dependencies to a minimum.
- Testing of the REST API is done using vscode's REST Client extension. See `test.rest` for examples. I've added it in recommended extensions (`extensions.json`).
- Before running `test.rest` curls, you need to `signup` and `signin` to create a new user in the database and get a jwt access and refresh tokens.
- `test.rest` uses a `$BEARER_EXAMPLE` jwt access token for testing purposes.
- Prisma ORM is used for database access.
- `zod` is used for request validation.

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

## License

Licensed under the [MIT license](https://github.com/aidoskanapyanov/take-home-task-xim-inc/blob/main/LICENSE).
