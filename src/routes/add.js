import { Router } from "express";
import { User } from "../models/user.model.js";
import { Cost } from "../models/cost.model.js";
import { CATEGORIES, assert, isPastMonth } from "../utils/validate.js";
import { logEndpointAccess } from "../middleware/requestLogger.js";

const router = Router();

// POST /api/add
router.post("/", async (req, res, next) => {
  try {
    await logEndpointAccess("/api/add");
    const { body } = req || {};

    // Create User
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

    // Create Cost
    const { description, category, userid, sum, date } = body;

    assert(
      typeof description === "string" && description.trim(),
      "description required"
    );
    assert(
      CATEGORIES.includes(category),
      `category must be one of: ${CATEGORIES.join(", ")}`
    );
    assert(typeof userid === "number", "userid must be Number");
    assert(typeof sum === "number", "sum must be Number");

    const costDate = date ? new Date(date) : new Date();
    assert(!isNaN(costDate), "invalid date");

    // No backdating to past months
    const year = costDate.getUTCFullYear();
    const month = costDate.getUTCMonth() + 1;
    assert(!isPastMonth(year, month), "cannot add costs dated to past months");

    const cost = await Cost.create({
      description,
      category,
      userid,
      sum,
      date: costDate,
    });
    return res.status(201).json(cost.toObject());
  } catch (err) {
    next(err);
  }
});

export default router;
