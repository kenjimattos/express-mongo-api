import { saleModel, userModel, bookModel } from "../models/index.js";
import BadRequestError from "../middlewares/errors/badRequestError.js";
import { PAYMENT_DISCOUNTS } from "../config/paymentTypes.js";

class SalesService {
  getSales() {
    return saleModel
      .find()
      .populate("user", "name email")
      .populate("items.book", "title");
  }

  async getSaleById(id) {
    return saleModel
      .findById(id)
      .populate("user", "name email")
      .populate("items.book", "title")
      .exec();
  }

  async createSale(payload) {
    const saleData = validateData(payload);

    const user = await userModel.findById(saleData.user);

    if (!user) {
      throw new BadRequestError(
        "Can't create sale: user not found.",
        "UNEXISTING_USER",
      );
    }

    const saleBooks = {
      _id: { $in: saleData.items.map((item) => item.book) },
    };
    const dbBooks = await bookModel.find(saleBooks);

    const items = saleData.items.map((item) => {
      const dbBook = dbBooks.find(
        (dbBook) => dbBook._id.toString() === item.book.toString(),
      );

      if (!dbBook) {
        throw new BadRequestError(
          `Can't create sale: book ${item.book} not found.`,
          "UNEXISTING_BOOK",
        );
      }

      return { book: item.book, quantity: item.quantity, price: dbBook.price };
    });

    const subtotal = round(
      items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    );

    const discountRate = Object.hasOwn(PAYMENT_DISCOUNTS, saleData.payment_type)
      ? PAYMENT_DISCOUNTS[saleData.payment_type]
      : 0;

    const discount = round(subtotal * discountRate);

    const total = round(subtotal - discount);

    return saleModel.create({
      user: saleData.user,
      items,
      subtotal,
      payment_type: saleData.payment_type,
      discount,
      total,
    });
  }

  async removeSale(id) {
    if (!id) {
      throw new BadRequestError(
        "Can't remove sale: no sale ID provided.",
        "MISSING_SALE_ID",
      );
    }
    return saleModel.findByIdAndDelete(id);
  }
}

export function validateData(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new BadRequestError(
      "Can't create sale: invalid data provided.",
      "INVALID_DATA",
    );
  }

  if (!Array.isArray(payload.items)) {
    throw new BadRequestError(
      "Can't create sale: items must be an array.",
      "INVALID_ITEMS",
    );
  }

  for (const item of payload.items) {
    if (!item?.book) {
      throw new BadRequestError(
        "Can't create sale: invalid item provided.",
        "INVALID_ITEMS",
      );
    }

    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new BadRequestError(
        "Can't create sale: item quantity must be a positive integer.",
        "INVALID_QUANTITY",
      );
    }
  }

  return payload;
}

export function round(value) {
  return Math.round(value * 100) / 100;
}

export default SalesService;
