import dotenv from "dotenv";
dotenv.config();
import { connectToDB } from "../src/utils/db.js";
import { User } from "../src/models/user.model.js";

await connectToDB(process.env.MONGODB_URI);
await User.deleteMany({});
await User.create({
  id: 123123,
  first_name: "mosh",
  last_name: "israeli",
  birthday: new Date("1990-01-01"),
});
console.log("seeded");
process.exit(0);
