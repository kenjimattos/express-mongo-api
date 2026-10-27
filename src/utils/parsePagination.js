import BadRequestError from "../middlewares/errors/badRequestError.js";

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 100;
const ORDERS = ["asc", "desc"];

export default function parsePagination(query, schema) {
  const sortBy = query.sortBy ?? "_id";
  const order = query.order ?? "asc";
  
  if (!ORDERS.includes(order)) {
    throw new BadRequestError("Order must be asc or desc");
  }

  const schemaType = schema.path(sortBy);
  
  // Reject sorting on fields that don't exist in the schema or are hidden from queries
  if (!schemaType || schemaType.options.select === false){
    throw new BadRequestError(`Can't order by ${sortBy}`);
  }
  // Protect against invalid or abusive values by clamping page and limit to sane bounds
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(query.limit) || DEFAULT_LIMIT)); 

  return { limit, page, sort: { [sortBy]: order } };
}