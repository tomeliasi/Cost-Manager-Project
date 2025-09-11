import { Router } from "express";
import { User } from "../models/user.model.js";
import { Cost } from "../models/cost.model.js";
import { CATEGORIES, assert, isPastMonth } from "../utils/validate.js";
import { logEndpointAccess } from "../middleware/requestLogger.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    await logEndpointAccess("/api/add");
    const body = req.body || {};

    // Heuristic: if request has User fields → create a new User
    if (
      "id" in body &&
      "first_name" in body &&
      "last_name" in body &&
      "birthday" in body
    ) {
      const { id, first_name, last_name, birthday } = body;
      assert(typeof id === "number", "id must be Number");
      const user = await User.create({ id, first_name, last_name, birthday });
      return res.status(201).json(user);
    }

    // Otherwise → expect a Cost object
    const { description, category, userid, sum, date } = body;

    // Validation
    assert(
      typeof description === "string" && description.trim(),
      "description required"
    );
    assert(
      CATEGORIES.includes(category),
      `category must be one of: ${CATEGORIES.join(", ")}`
    );
    assert(typeof userid === "string", "userid must be String");
    assert(
      typeof sum === "number" || typeof sum === "string",
      "sum must be Number"
    );

    // Handle date: if provided → validate, otherwise → default now
    let costDate = date ? new Date(date) : new Date();
    assert(!isNaN(costDate), "invalid date");

    // Application rule: cannot add costs dated to past months
    assert(
      !isPastMonth(costDate.getUTCFullYear(), costDate.getUTCMonth() + 1),
      "cannot add costs dated to past months"
    );

    // Create the document in MongoDB
    const created = await Cost.create({
      description,
      category,
      userid,
      sum,
      date: costDate,
    });

    // Convert Decimal128/Number to clean JSON
    const json = created.toObject();
    json.sum = Number(json.sum);
    return res.status(201).json(json);
  } catch (e) {
    next(e);
  }
});

export default router;
