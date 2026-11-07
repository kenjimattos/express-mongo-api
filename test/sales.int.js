import mongoose from "mongoose";
import connectDatabase from "../src/config/dbConnect.js";
import AuthorsService from "../src/services/authorsService.js";
import BooksService from "../src/services/booksService.js";
import SalesService from "../src/services/salesService.js";
import UsersService from "../src/services/usersService.js";
import { saleModel } from "../src/models/index.js";
import BadRequestError from "../src/middlewares/errors/badRequestError.js";
import { describe, test, before, after } from "node:test";
import assert from "node:assert";

const authorsService = new AuthorsService();
const booksService = new BooksService();
const salesService = new SalesService();
const usersService = new UsersService();

before(async () => {
  await connectDatabase();
});

after(async () => {
  await mongoose.disconnect();
});

describe("Sales Integration", () => {
  // MARK: - TEST 1
  test("create sale with unexisting user", async () => {
    const author = await authorsService.createAuthor({
      name: "Chris Claremont",
      nationality: "United Kingdom",
    });

    const book = await booksService.createBook({
      title: "Uncanny X-Men",
      author: author.id,
      publisher: "Marvel Comics",
      price: 100,
      pages: 100,
    });

    after(async () => {
      await booksService.removeBook(book.id);
      await authorsService.removeAuthor(author.id);
    });

    await assert.rejects(
      salesService.createSale({
        user: new mongoose.Types.ObjectId(),
        items: [
          {
            book: book._id,
            quantity: 1,
          },
        ],
        payment_type: "credit",
      }),
      (error) => {
        assert.ok(error instanceof BadRequestError);
        assert.strictEqual(error.status, 400);
        assert.strictEqual(error.type, "UNEXISTING_USER");
        return true;
      },
    );
  });

  // MARK: - TEST 2
  test("create sale with unexisting book", async () => {
    const user = await usersService.createUser({
      name: "Clark Kent",
      email: "clark.kent@example.com",
      password: "Password123!",
    });

    after(async () => {
      await usersService.removeUser(user.id);
    });

    await assert.rejects(
      salesService.createSale({
        user: user._id,
        items: [
          {
            book: new mongoose.Types.ObjectId(),
            quantity: 1,
          },
        ],
        payment_type: "credit",
      }),
      (error) => {
        assert.ok(error instanceof BadRequestError);
        assert.strictEqual(error.status, 400);
        assert.strictEqual(error.type, "UNEXISTING_BOOK");
        return true;
      },
    );
  });

  // MARK: - TEST 3
  test("create sale with unexisting book on multiple items", async () => {
    const author = await authorsService.createAuthor({
      name: "John Byrne",
      nationality: "United Kingdom",
    });

    const book_1 = await booksService.createBook({
      title: "Alpha Flight",
      author: author.id,
      publisher: "Marvel Comics",
      price: 100,
      pages: 100,
    });

    const book_2 = {
      id: new mongoose.Types.ObjectId().toString(),
    };

    const user = await usersService.createUser({
      name: "Barry Allen",
      email: "barry.allen@example.com",
      password: "Password123!",
    });

    after(async () => {
      await booksService.removeBook(book_1.id);
      await authorsService.removeAuthor(author.id);
      await usersService.removeUser(user.id);
    });

    await assert.rejects(
      salesService.createSale({
        user: user._id,
        items: [
          {
            book: book_1._id,
            quantity: 1,
          },
          {
            book: book_2.id,
            quantity: 1,
          },
        ],
        payment_type: "credit",
      }),
      (error) => {
        assert.ok(error instanceof BadRequestError);
        assert.strictEqual(error.status, 400);
        assert.strictEqual(error.type, "UNEXISTING_BOOK");
        return true;
      },
    );
    assert.strictEqual(await saleModel.countDocuments({ user: user._id }), 0);
  });

  // MARK: - TEST 4
  test("sale calculation (credit)", async () => {
    const author = await authorsService.createAuthor({
      name: "Walt Simonson",
      nationality: "United States",
    });

    const book_1 = await booksService.createBook({
      title: "Mighty Thor",
      author: author.id,
      publisher: "Marvel Comics",
      price: 100,
      pages: 100,
    });

    const book_2 = await booksService.createBook({
      title: "Beta Ray Bill",
      author: author.id,
      publisher: "Marvel Comics",
      price: 75,
      pages: 100,
    });

    const user = await usersService.createUser({
      name: "Diana Prince",
      email: "diana.prince@example.com",
      password: "Password123!",
    });

    let sale;

    after(async () => {
      await salesService.removeSale(sale.id);
      await booksService.removeBook(book_1.id);
      await booksService.removeBook(book_2.id);
      await authorsService.removeAuthor(author.id);
      await usersService.removeUser(user.id);
    });

    sale = await salesService.createSale({
      user: user._id,
      items: [
        {
          book: book_1._id,
          quantity: 1,
        },
        {
          book: book_2._id,
          quantity: 2,
        },
      ],
      payment_type: "credit",
    });

    assert.strictEqual(sale.items[0].price, 100);
    assert.strictEqual(sale.items[1].price, 75);

    assert.strictEqual(sale.subtotal, 250);
    assert.strictEqual(sale.discount, 0);
    assert.strictEqual(sale.total, 250);
  });

  // MARK: - TEST 5
  test("sale calculation (debit)", async () => {
    const author = await authorsService.createAuthor({
      name: "Ed Brubaker",
      nationality: "United States",
    });

    const book_1 = await booksService.createBook({
      title: "Captain America",
      author: author.id,
      publisher: "Marvel Comics",
      price: 100,
      pages: 100,
    });

    const book_2 = await booksService.createBook({
      title: "Winter Soldier",
      author: author.id,
      publisher: "Marvel Comics",
      price: 75,
      pages: 100,
    });

    const user = await usersService.createUser({
      name: "Hal Jordan",
      email: "hal.jordan@example.com",
      password: "Password123!",
    });

    let sale;

    after(async () => {
      await salesService.removeSale(sale.id);
      await booksService.removeBook(book_1.id);
      await booksService.removeBook(book_2.id);
      await authorsService.removeAuthor(author.id);
      await usersService.removeUser(user.id);
    });

    sale = await salesService.createSale({
      user: user._id,
      items: [
        {
          book: book_1._id,
          quantity: 1,
        },
        {
          book: book_2._id,
          quantity: 2,
        },
      ],
      payment_type: "debit",
    });

    assert.strictEqual(sale.items[0].price, 100);
    assert.strictEqual(sale.items[1].price, 75);

    assert.strictEqual(sale.subtotal, 250);
    assert.strictEqual(sale.discount, 0);
    assert.strictEqual(sale.total, 250);
  });

  // MARK: - TEST 6
  test("calculation don't use payload fields", async () => {
    const author = await authorsService.createAuthor({
      name: "Kelly Thompson",
      nationality: "United States",
    });

    const book_1 = await booksService.createBook({
      title: "Hawkeye",
      author: author.id,
      publisher: "Marvel Comics",
      price: 100,
      pages: 100,
    });

    const book_2 = await booksService.createBook({
      title: "Rogue & Gambit",
      author: author.id,
      publisher: "Marvel Comics",
      price: 75,
      pages: 100,
    });

    const user = await usersService.createUser({
      name: "Bruce Wayne",
      email: "bruce.wayne@example.com",
      password: "Password123!",
    });

    let sale;

    after(async () => {
      await salesService.removeSale(sale.id);
      await booksService.removeBook(book_1.id);
      await booksService.removeBook(book_2.id);
      await authorsService.removeAuthor(author.id);
      await usersService.removeUser(user.id);
    });

    sale = await salesService.createSale({
      user: user._id,
      items: [
        {
          book: book_1._id,
          quantity: 1,
          price: 25,
        },
        {
          book: book_2._id,
          quantity: 2,
          price: 30,
        },
      ],
      payment_type: "boleto",
      subtotal: 85,
      discount: 15,
      total: 65,
    });

    assert.strictEqual(sale.items[0].price, 100);
    assert.strictEqual(sale.items[1].price, 75);

    assert.strictEqual(sale.subtotal, 250);
    assert.strictEqual(sale.discount, 7.5);
    assert.strictEqual(sale.total, 242.5);
  });

  // MARK: - TEST 7
  test("calculation round (pix)", async () => {
    const author = await authorsService.createAuthor({
      name: "Matt Fraction",
      nationality: "United States",
    });

    const book = await booksService.createBook({
      title: "Immortal Iron Fist",
      author: author.id,
      publisher: "Marvel Comics",
      price: 33.33,
      pages: 100,
    });

    const user = await usersService.createUser({
      name: "Arthur Curry",
      email: "arthur.curry@example.com",
      password: "Password123!",
    });

    let sale;

    after(async () => {
      await salesService.removeSale(sale.id);
      await booksService.removeBook(book.id);
      await authorsService.removeAuthor(author.id);
      await usersService.removeUser(user.id);
    });

    sale = await salesService.createSale({
      user: user._id,
      items: [
        {
          book: book._id,
          quantity: 1,
        },
      ],
      payment_type: "pix",
    });

    assert.strictEqual(sale.items[0].price, 33.33);

    assert.strictEqual(sale.subtotal, 33.33);
    assert.strictEqual(sale.discount, 1.67);
    assert.strictEqual(sale.total, 31.66);
  });

  // MARK: - TEST 8
  test("calculation round (boleto)", async () => {
    const author = await authorsService.createAuthor({
      name: "Al Ewing",
      nationality: "United Kingdom",
    });

    const book = await booksService.createBook({
      title: "Guardians of the Galaxy",
      author: author.id,
      publisher: "Marvel Comics",
      price: 19.9,
      pages: 100,
    });

    const user = await usersService.createUser({
      name: "Oliver Queen",
      email: "oliver.queen@example.com",
      password: "Password123!",
    });

    let sale;

    after(async () => {
      await salesService.removeSale(sale.id);
      await booksService.removeBook(book.id);
      await authorsService.removeAuthor(author.id);
      await usersService.removeUser(user.id);
    });

    sale = await salesService.createSale({
      user: user._id,
      items: [
        {
          book: book._id,
          quantity: 3,
        },
      ],
      payment_type: "boleto",
    });

    assert.strictEqual(sale.items[0].price, 19.9);

    assert.strictEqual(sale.subtotal, 59.7);
    assert.strictEqual(sale.discount, 1.79);
    assert.strictEqual(sale.total, 57.91);
  });

  // MARK: - TEST 9
  test("invalid payment type", async () => {
    const user = await usersService.createUser({
      name: "Selina Kyle",
      email: "selina.kyle@example.com",
      password: "Password123!",
    });

    const author = await authorsService.createAuthor({
      name: "Brian Michael Bendis",
      nationality: "United States",
    });

    const book = await booksService.createBook({
      title: "Jessica Jones",
      author: author.id,
      publisher: "Marvel Comics",
      price: 100,
      pages: 100,
    });

    after(async () => {
      await booksService.removeBook(book.id);
      await authorsService.removeAuthor(author.id);
      await usersService.removeUser(user.id);
    });

    await assert.rejects(
      salesService.createSale({
        user: user._id,
        items: [
          {
            book: book._id,
            quantity: 1,
          },
        ],
        payment_type: "cash",
      }),
      (error) => {
        assert.ok(error instanceof mongoose.Error.ValidationError);
        assert.ok(error.errors.payment_type);
        return true;
      },
    );
  });

  // MARK: - TEST 10
  test("empty payment type", async () => {
    const user = await usersService.createUser({
      name: "Kara Danvers",
      email: "kara.danvers@example.com",
      password: "Password123!",
    });

    const author = await authorsService.createAuthor({
      name: "Gerry Conway",
      nationality: "United States",
    });

    const book = await booksService.createBook({
      title: "Punisher",
      author: author.id,
      publisher: "Marvel Comics",
      price: 100,
      pages: 100,
    });

    after(async () => {
      await booksService.removeBook(book.id);
      await authorsService.removeAuthor(author.id);
      await usersService.removeUser(user.id);
    });

    await assert.rejects(
      salesService.createSale({
        user: user._id,
        items: [
          {
            book: book._id,
            quantity: 1,
          },
        ],
        payment_type: "",
      }),
      (error) => {
        assert.ok(error instanceof mongoose.Error.ValidationError);
        assert.ok(error.errors.payment_type);
        return true;
      },
    );
  });

  // MARK: - TEST 11
  test("invalid item", async () => {
    const user = await usersService.createUser({
      name: "Victor Stone",
      email: "victor.stone@example.com",
      password: "Password123!",
    });

    after(async () => {
      await usersService.removeUser(user.id);
    });

    await assert.rejects(
      salesService.createSale({
        user: user._id,
        items: [],
        payment_type: "credit",
      }),
      (error) => {
        assert.ok(error instanceof mongoose.Error.ValidationError);
        assert.ok(error.errors.items);
        return true;
      },
    );
  });
});
