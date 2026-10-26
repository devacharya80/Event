import { z } from "zod";
import {
  EVENT_TYPES, PLANNER_SERVICES, PLANNING_SCOPES,
  PERFORMER_TYPES, CREW_ROLES, EXPERIENCE_LEVELS,
} from "../config/constants.js";

const base = {
  eventName: z.string().trim().min(3, "Min 3 characters").max(100),
  eventType: z.enum(EVENT_TYPES),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  location: z.string().trim().min(2).max(120),
  venue: z.string().trim().max(120).optional(),
};

const budget = {
  budgetMin: z.number().min(0),
  budgetMax: z.number().min(0),
};

const notes = z.string().trim().max(1000).optional();

const planner = z.strictObject({
  ...base,
  category: z.literal("planner"),
  servicesNeeded: z.array(z.enum(PLANNER_SERVICES)).min(1, "Select at least one service"),
  planningScope: z.enum(PLANNING_SCOPES),
  guestCount: z.number().int().min(1),
  ...budget,
  notes,
});

const performer = z.strictObject({
  ...base,
  category: z.literal("performer"),
  performerType: z.enum(PERFORMER_TYPES),
  genre: z.string().trim().max(60).optional(),
  durationMinutes: z.number().int().min(5).max(600),
  audienceSize: z.number().int().min(1),
  equipmentProvided: z.boolean().default(false),
  ...budget,
  notes,
});

const crew = z.strictObject({
  ...base,
  category: z.literal("crew"),
  rolesNeeded: z.array(z.enum(CREW_ROLES)).min(1, "Select at least one role"),
  crewSize: z.number().int().min(1).max(500),
  shiftHours: z.number().min(1).max(24),
  experienceLevel: z.enum(EXPERIENCE_LEVELS),
  accommodationProvided: z.boolean().default(false),
  ...budget,
  notes,
});

export const requirementSchema = z
  .discriminatedUnion("category", [planner, performer, crew])
  .superRefine((d, ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (d.startDate < today) {
      ctx.addIssue({ code: "custom", path: ["startDate"], message: "Start date cannot be in the past" });
    }
    if (d.endDate && d.endDate < d.startDate) {
      ctx.addIssue({ code: "custom", path: ["endDate"], message: "End date must be on or after start date" });
    }
    if (d.budgetMax < d.budgetMin) {
      ctx.addIssue({ code: "custom", path: ["budgetMax"], message: "Max budget must be at least min budget" });
    }
  });