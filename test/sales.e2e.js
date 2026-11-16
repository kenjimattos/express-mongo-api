import { describe, test, after } from "node:test";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import assert from "node:assert";
import CreateHelper from "./helpers/createHelper.js";

const create = new CreateHelper(app);

after(async () => {
  await mongoose.disconnect();
});

describe("Sales Routes", () => {
  after(async () => {
    await create.cleanup();
  });

  // MARK: - /POST
  test("create a new sale", async () => {
    const { author } = await create.author({
      name: "Graciliano Ramons",
      nationality: "Brazil",
    });

    const { book } = await create.book({
      title: "Vidas secas",
      author: author._id,
      publisher: "Principis",
      price: 100,
      pages: 100,
    });

    const { user } = await create.user({
      name: "Dick Grayson",
      email: "dick.grayson@example.com",
      password: "Password123!",
    });

    const { response, sale } = await create.sale({
      user: user._id,
      items: [
        {
          book: book._id,
          quantity: 1,
        },
      ],
      payment_type: "pix",
    });

    assert.strictEqual(response.status, 201);
    assert.strictEqual(sale.items[0].price, 100);
    assert.strictEqual(sale.subtotal, 100);
    assert.strictEqual(sale.discount, 5);
    assert.strictEqual(sale.total, 95);
    assert.strictEqual(sale.payment_type, "pix");
    assert.ok(sale._id);
    assert.ok(sale.created_at);
  });

  test("calculation don't use payload fields", async () => {
    const { author } = await create.author({
      name: "Fyodor Dostoevsky",
      nationality: "Russia",
    });

    const { book } = await create.book({
      title: "Crime and Punishment",
      author: author._id,
      publisher: "Principis",
      price: 100,
      pages: 100,
    });

    const { user } = await create.user({
      name: "Tim Drake",
      email: "tim.drake@example.com",
      password: "Password123!",
    });

    const { response, sale } = await create.sale({
      user: user._id,
      items: [
        {
          book: book._id,
          quantity: 1,
          price: 19.9,
        },
      ],
      payment_type: "boleto",
      subtotal: 19.9,
      discount: 5,
      total: 14.9,
    });

    assert.strictEqual(response.status, 201);
    assert.strictEqual(sale.items[0].price, 100);
    assert.strictEqual(sale.subtotal, 100);
    assert.strictEqual(sale.discount, 3);
    assert.strictEqual(sale.total, 97);
    assert.strictEqual(sale.payment_type, "boleto");
    assert.ok(sale._id);
    assert.ok(sale.created_at);
  });

  test("create sale with unexisting user", async () => {
    const { author } = await create.author({
      name: "José de Alencar",
      nationality: "Brazil",
    });

    const { book } = await create.book({
      title: "Iracema",
      author: author._id,
      publisher: "Principis",
      price: 100,
      pages: 100,
    });

    const { response } = await create.sale({
      user: new mongoose.Types.ObjectId(),
      items: [
        {
          book: book._id,
          quantity: 1,
        },
      ],
      payment_type: "boleto",
    });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.type, "UNEXISTING_USER");
  });

  test("create sale with invalid user", async () => {
    const { author } = await create.author({
      name: "João Guimarães Rosa",
      nationality: "Brazil",
    });

    const { book } = await create.book({
      title: "Grande Sertão: Veredas",
      author: author._id,
      publisher: "Principis",
      price: 100,
      pages: 100,
    });

    const { response } = await create.sale({
      user: "abc",
      items: [
        {
          book: book._id,
          quantity: 1,
        },
      ],
      payment_type: "boleto",
    });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.type, "BAD_REQUEST");
  });

  test("create sale with unexisting book", async () => {
    const { user } = await create.user({
      name: "Jason Todd",
      email: "jason.todd@example.com",
      password: "Password123!",
    });

    const { response } = await create.sale({
      user: user._id,
      items: [
        {
          book: new mongoose.Types.ObjectId(),
          quantity: 1,
        },
      ],
      payment_type: "debit",
    });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.type, "UNEXISTING_BOOK");
  });

  test("create sale with unexisting payment type", async () => {
    const { author } = await create.author({
      name: "Eça de Queirós",
      nationality: "Brazil",
    });

    const { book } = await create.book({
      title: "O Primo Basílio",
      author: author._id,
      publisher: "Principis",
      price: 100,
      pages: 100,
    });

    const { user } = await create.user({
      name: "Damian Wayne",
      email: "damian.wayne@example.com",
      password: "Password123!",
    });

    const { response } = await create.sale({
      user: user._id,
      items: [
        {
          book: book._id,
          quantity: 1,
        },
      ],
    });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.type, "VALIDATION_ERROR");
  });

  test("create sale with invalid items", async () => {
    const { user } = await create.user({
      name: "Oswald Cobblepot",
      email: "oswald.cobblepot@example.com",
      password: "Password123!",
    });

    const { response } = await create.sale({
      user: user._id,
      items: "invalid",
    });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.type, "INVALID_ITEMS");
  });

  test("create sale with invalid quantity", async () => {
    const { author } = await create.author({
      name: "Aluísio Azevedo",
      nationality: "Brazil",
    });

    const { book } = await create.book({
      title: "O cortiço",
      author: author._id,
      publisher: "Principis",
      price: 100,
      pages: 100,
    });

    const { user } = await create.user({
      name: "Harvey Dent",
      email: "harvey.dent@example.com",
      password: "Password123!",
    });

    const { response } = await create.sale({
      user: user._id,
      items: [
        {
          book: book._id,
        },
      ],
      payment_type: "pix",
    });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.type, "INVALID_QUANTITY");
  });

  test("create sale with invalid data", async () => {
    const invalidData = [[], {}];

    for (const data of invalidData) {
      const { response } = await create.sale(data);

      assert.strictEqual(response.status, 400);
      assert.strictEqual(response.body.type, "INVALID_DATA");
    }
  });

  // MARK: - /GET
  test("get sales", async () => {
    const { author } = await create.author({
      name: "Cecília Meireles",
      nationality: "Brazil",
    });

    const { book } = await create.book({
      title: "Viagem",
      author: author._id,
      publisher: "Principis",
      price: 100,
      pages: 100,
    });

    const { user } = await create.user({
      name: "Jonathan Crane",
      email: "jonathan.crane@example.com",
      password: "Password123!",
    });

    const { sale } = await create.sale({
      user: user._id,
      items: [
        {
          book: book._id,
          quantity: 1,
        },
      ],
      payment_type: "credit",
    });

    await request(app)
      .get("/sales")
      .expect(200)
      .expect((response) => {
        assert.ok(response.body.some((s) => s._id === sale._id));

        const found = response.body.find((s) => s._id === sale._id);
        assert.ok(found);
        assert.strictEqual(found.user.name, user.name);
        assert.strictEqual(found.items[0].book.title, book.title);
      });
  });

  test("get sale by id", async () => {
    const { author } = await create.author({
      name: "Clarice Lispector",
      nationality: "Brazil",
    });

    const { book } = await create.book({
      title: "A hora da estrela",
      author: author._id,
      publisher: "Principis",
      price: 100,
      pages: 100,
    });

    const { user } = await create.user({
      name: "Harley Quinn",
      email: "harley.quinn@example.com",
      password: "Password123!",
    });

    const { sale } = await create.sale({
      user: user._id,
      items: [
        {
          book: book._id,
          quantity: 1,
        },
      ],
      payment_type: "credit",
    });

    await request(app)
      .get(`/sales/${sale._id}`)
      .expect(200)
      .expect((response) => {
        assert.strictEqual(response.body._id, String(sale._id));
        assert.strictEqual(response.body.user.name, user.name);
        assert.strictEqual(response.body.items[0].book.title, book.title);
      });
  });

  test("get sale by unexisting id", async () => {
    const unexisting = new mongoose.Types.ObjectId();

    await request(app)
      .get(`/sales/${unexisting}`)
      .expect(404)
      .expect((response) => {
        assert.strictEqual(response.body.type, "NOT_FOUND");
      });
  });

  test("get sale by invalid id", async () => {
    const invalid = "abc";

    await request(app)
      .get(`/sales/${invalid}`)
      .expect(400)
      .expect((response) => {
        assert.strictEqual(response.body.type, "BAD_REQUEST");
      });
  });

  //MARK: - /DELETE
  test("remove sale", async () => {
    const { author } = await create.author({
      name: "Jorge Amado",
      nationality: "Brazil",
    });

    const { book } = await create.book({
      title: "Gabriela, Cravo e Canela",
      author: author._id,
      publisher: "Principis",
      price: 100,
      pages: 100,
    });

    const { user } = await create.user({
      name: "Edward Nygma",
      email: "edward.nigma@example.com",
      password: "Password123!",
    });

    const { sale } = await create.sale({
      user: user._id,
      items: [
        {
          book: book._id,
          quantity: 1,
        },
      ],
      payment_type: "credit",
    });

    await request(app)
      .delete(`/sales/${sale._id}`)
      .expect(201)
      .expect((response) => {
        assert.strictEqual(response.body.sale._id, String(sale._id));
        assert.strictEqual(response.body.sale.user.name, user.name);
        assert.strictEqual(response.body.sale.items[0].book.title, book.title);
      });

    await request(app)
      .get(`/sales/${sale._id}`)
      .expect(404)
      .expect((response) => {
        assert.strictEqual(response.body.type, "NOT_FOUND");
      });
  });

  test("remove unexisting sale", async () => {
    const unexistingId = new mongoose.Types.ObjectId();

    await request(app)
      .delete(`/sales/${unexistingId}`)
      .expect(404)
      .expect((response) => {
        assert.strictEqual(response.body.type, "NOT_FOUND");
      });
  });

  test("remove invalid sale", async () => {
    const invalidId = "abc";

    await request(app)
      .delete(`/sales/${invalidId}`)
      .expect(400)
      .expect((response) => {
        assert.strictEqual(response.body.type, "BAD_REQUEST");
      });
  });
  
});
