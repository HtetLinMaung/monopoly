import mongoose from "mongoose";
// import { log } from "starless-logger";

export default async function connectMongoose() {
  const { MONGO_URI } = process.env;
  if (!MONGO_URI) {
    throw new Error(
      "Please specify a Mongoose URL to connect to the database connection!"
    );
  }
  await mongoose.connect(MONGO_URI);
  // log("Connected to Mongoose");
}
