import { z } from "zod";
import { EVENT_TYPES, CATEGORIES } from "./constants";

const today = () => new Date().toLocaleDateString("en-CA"); // local YYYY-MM-DD

export const step1Schema = z
  .object({
    eventName: z
      .string()
      .trim()
      .min(3, "Min 3 characters")
      .max(100, "Max 100 characters"),
    eventType: z.enum(
      EVENT_TYPES.map((t) => t.value),
      { error: "Select an event type" },
    ),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    location: z.string().trim().min(2, "Location is required").max(120),
    venue: z.string().trim().max(120).optional(),
    category: z.enum(
      CATEGORIES.map((c) => c.value),
      { error: "Choose a category" },
    ),
  })
  .superRefine((d, ctx) => {
    if (d.startDate && d.startDate < today()) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "Start date cannot be in the past",
      });
    }
    if (d.endDate && d.startDate && d.endDate < d.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be on or after start date",
      });
    }
  });
