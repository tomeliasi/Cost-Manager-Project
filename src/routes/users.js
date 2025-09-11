import { Router } from "express";
import { User } from "../models/user.model.js";
import { Cost } from "../models/cost.model.js";
import { assert } from "../utils/validate.js";
import { logEndpointAccess } from "../middleware/requestLogger.js";

const router = Router();

// GET /api/users – list
router.get("/", async (req, res, next) => {
  try {
    await logEndpointAccess("/api/users");
    const users = await User.find().lean();
    res.json(users);
  } catch (e) {
    next(e);
  }
});

// GET /api/users/:id – details + total
router.get("/:id", async (req, res, next) => {
  try {
    await logEndpointAccess("/api/users/:id");
    const id = Number(req.params.id);
    const user = await User.findOne({ id }).lean();
    assert(user, "user not found", 404);

    const agg = await Cost.aggregate([
      { $match: { userid: id } },
      { $group: { _id: null, total: { $sum: { $toDouble: "$sum" } } } },
    ]);

    const total = agg.length ? agg[0].total : 0;
    res.json({
      first_name: user.first_name,
      last_name: user.last_name,
      id: user.id,
      total,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
