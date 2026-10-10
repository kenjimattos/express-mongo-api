# express-mongo-api

Bookstore REST API built with Node.js, Express and MongoDB (Mongoose), providing CRUD for authors, books and users.

The project follows the MVC (Model-View-Controller) pattern: Mongoose schemas in `src/models`, request handling in `src/controllers` and endpoint definitions in `src/routes`. As a REST API, the "view" is the JSON response.

## Technologies

- Node.js (ES Modules)
- Express 5
- Nodemon
- MongoDB + Mongoose
- bcrypt (password hashing)
- ESLint

## Routes

### Authors

| Method | Route          | Description      |
| ------ | -------------- | ---------------- |
| GET    | `/authors`     | List authors     |
| GET    | `/authors/:id` | Get author by ID |
| POST   | `/authors`     | Create author    |
| PUT    | `/authors/:id` | Update author    |
| DELETE | `/authors/:id` | Delete author    |

### Books

| Method | Route                                | Description             |
| ------ | ------------------------------------ | ----------------------- |
| GET    | `/books`                             | List books              |
| GET    | `/books/query?publisher=<publisher>` | Find books by publisher |
| GET    | `/books/:id`                         | Get book by ID          |
| POST   | `/books`                             | Create book             |
| PUT    | `/books/:id`                         | Update book             |
| DELETE | `/books/:id`                         | Delete book             |

### Users

| Method | Route        | Description    |
| ------ | ------------ | -------------- |
| GET    | `/users`     | List users     |
| GET    | `/users/:id` | Get user by ID |
| POST   | `/users`     | Create user    |
| PUT    | `/users/:id` | Update user    |
| DELETE | `/users/:id` | Delete user    |
