// Users routes: list users and get user details (with total costs)

import { Router } from "express";
import { User } from "../models/user.model.js";
import { Cost } from "../models/cost.model.js";
import { assert } from "../utils/validate.js";
import { logEndpointAccess } from "../middleware/requestLogger.js";

const router = Router();

// GET /api/users → list all users
router.get("/", async (_req, res, next) => {
  try {
    await logEndpointAccess("/api/users");
    const users = await User.find().lean();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET /api/users/:id → user details + total sum of costs
router.get("/:id", async (req, res, next) => {
  try {
    await logEndpointAccess("/api/users/:id");

    const userId = Number(req.params.id);
    assert(Number.isInteger(userId), "invalid user id");

    const user = await User.findOne({ id: userId }).lean();
    assert(user, "user not found", 404);

    const totalAgg = await Cost.aggregate([
      { $match: { userid: userId } },
      { $group: { _id: null, total: { $sum: "$sum" } } },
    ]);

    const total = totalAgg.length ? totalAgg[0].total : 0;

    res.json({
      first_name: user.first_name,
      last_name: user.last_name,
      id: user.id,
      total,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
