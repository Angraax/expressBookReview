# Express Book Review API

## Run

```powershell
npm install
$env:JWT_SECRET = "use-a-long-random-secret"
npm start
```

The server listens on `http://localhost:3000` by default. Set `PORT` to use another port.

## Endpoints

- `GET /books`
- `GET /books/isbn/:isbn`
- `GET /books/author/:author`
- `GET /books/title/:title`
- `GET /books/:isbn/review`
- `POST /register` with `{"username":"...","password":"..."}`
- `POST /login` with `{"username":"...","password":"..."}`
- `PUT /auth/review/:isbn` with `{"review":"..."}` and a Bearer JWT
- `DELETE /auth/review/:isbn` with a Bearer JWT

`general.js` exports Axios async/await helpers for the four book retrieval and search operations.
