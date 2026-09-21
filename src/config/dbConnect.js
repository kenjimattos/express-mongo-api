import mongoose from "mongoose";

const { DB_CONNECTION_STRING, DB_NAME } = process.env;

async function connectDatabase() {
  mongoose.connect(DB_CONNECTION_STRING, { dbName: DB_NAME });

  return mongoose.connection;
  
};

export default connectDatabase