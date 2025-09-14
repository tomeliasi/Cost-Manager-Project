import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true }, /* numeric ID */
    first_name: { type: String, required: true }, /* first name */
    last_name: { type: String, required: true }, /* last name */
    birthday: { type: Date, required: true }, /* date of birth */
  },
  { collection: "users" } /* use "users" collection */
);

export const User = mongoose.model("User", userSchema);
