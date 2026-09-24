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

| Method | Route         | Description         |
| ------ | ------------- | ------------------- |
| GET    | `/author`     | List authors        |
| GET    | `/author/:id` | Get author by ID    |
| POST   | `/author`     | Create author       |
| PUT    | `/author/:id` | Update author       |
| DELETE | `/author/:id` | Delete author       |

### Books

| Method | Route                              | Description               |
| ------ | ---------------------------------- | ------------------------- |
| GET    | `/book`                            | List books                |
| GET    | `/book/query?publisher=<publisher>` | Find books by publisher   |
| GET    | `/book/:id`                        | Get book by ID            |
| POST   | `/book`                            | Create book               |
| PUT    | `/book/:id`                        | Update book               |
| DELETE | `/book/:id`                        | Delete book               |

### Users

| Method | Route       | Description       |
| ------ | ----------- | ----------------- |
| GET    | `/user`     | List users        |
| GET    | `/user/:id` | Get user by ID    |
| POST   | `/user`     | Create user       |
| PUT    | `/user/:id` | Update user       |
| DELETE | `/user/:id` | Delete user       |
