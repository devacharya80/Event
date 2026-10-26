import mongoose from "mongoose";
import { z } from "zod";
import Requirement, { Planner, Performer, Crew } from "../models/Requirement.js";
import { requirementSchema } from "../validators/requirement.validator.js";
import { CATEGORIES } from "../config/constants.js";

const models = { planner: Planner, performer: Performer, crew: Crew };

const listQuerySchema = z.object({
  category: z.enum(CATEGORIES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const createRequirement = async (req, res) => {
  const data = requirementSchema.parse(req.body);
  const doc = await models[data.category].create(data);
  res.status(201).json({ success: true, data: doc });
};

export const listRequirements = async (req, res) => {
  // Express 5: req.query is read-only, so parse into a local variable
  const { category, page, limit } = listQuerySchema.parse(req.query);
  const filter = category ? { category } : {};

  const [items, total] = await Promise.all([
    Requirement.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Requirement.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};

export const getRequirement = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid id" });
  }
  const doc = await Requirement.findById(id).lean();
  if (!doc) return res.status(404).json({ success: false, message: "Requirement not found" });
  res.json({ success: true, data: doc });
};