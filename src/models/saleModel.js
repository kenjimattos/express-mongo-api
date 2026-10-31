import mongoose from "mongoose";
import { PAYMENT_DISCOUNTS } from "../config/paymentTypes.js";

const saleItemSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      required: [true, "Sale item book is required"],
    },
    price: {
      type: Number,
      required: [true, "Sale item price is required"],
      validate: {
        validator: (value) => {
          return value > 0;
        },
        message:
          "{VALUE} isn't a valid price. Item price must be greater than 0",
      },
    },
    quantity: {
      type: Number,
      required: [true, "Sale item quantity is required"],
      validate: {
        validator: (value) => {
          return Number.isInteger(value) && value >= 1;
        },
        message:
          "{VALUE} isn't a valid quantity. Quantity must be an integer of at least 1",
      },
    },
  },
  { _id: false },
);

const saleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User ID is required"],
    },
    items: {
      type: [saleItemSchema],
      validate: {
        validator: (value) => {
          return value.length >= 1;
        },
        message: "A sale must have at least one item",
      },
    },
    subtotal: {
      type: Number,
      required: [true, "Sale subtotal is required"],
    },
    payment_type: {
      type: String,
      required: [true, "Sale payment type is required"],
      enum: {
        values: Object.keys(PAYMENT_DISCOUNTS),
        message: "{VALUE} isn't a valid payment type.",
      }
    },
    discount: {
      type: Number,
      required: [true, "Sale discount is required"],
      min: [0, "Sale discount can't be negative"],
    },
    total: {
      type: Number,
      min: [0, "Sale total can't be negative"],
      required: [true, "Sale total is required"],
    },
  },
  { versionKey: false },
);

const saleModel = mongoose.model("sale", saleSchema);

export default saleModel;
