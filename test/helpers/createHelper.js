import request from "supertest";

class CreateHelper {
  constructor(app){
    this.app = app;
    this.created = [];
  }

  async create(path, key, data) {
    const response = await request(this.app).post(path).send(data);
    const resource = response.body[key];
    if (resource) this.created.push(`${path}/${resource._id}`);
    return { response, [key]: resource };
  }
  
  author(data) {
    return this.create("/authors", "author", data);
  }

  book(data) {
    return this.create("/books", "book", data);
  }

  user(data) {
    return this.create("/users", "user", data);
  }

  async cleanup() {
    const urls = this.created.reverse();
    this.created = [];
    for (const url of urls) await request(this.app).delete(url);
  }

}

export default CreateHelper;