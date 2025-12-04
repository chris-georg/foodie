import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://bonifacexoftt:220222@cluster0.fqb6jix.mongodb.net/foodie"
    )
    .then(() => console.log("DB Connected"));
};
