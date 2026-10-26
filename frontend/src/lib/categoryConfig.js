import { z } from "zod";
import {
  PLANNER_SERVICES, PLANNING_SCOPES, PERFORMER_TYPES, CREW_ROLES, EXPERIENCE_LEVELS,
} from "./constants";

const vals = (list) => list.map((o) => o.value);

// valueAsNumber gives NaN for an empty input, which z.number() rejects with this message
const num = (label, { min, max, int = true } = {}) => {
  let s = z.number({ error: `${label} is required` });
  if (int) s = s.int("Whole numbers only");
  if (min !== undefined) s = s.min(min, `Min ${min}`);
  if (max !== undefined) s = s.max(max, `Max ${max}`);
  return s;
};

const optText = (max) => z.string().trim().max(max, `Max ${max} characters`).optional();

const budgetShape = {
  budgetMin: num("Min budget", { min: 0 }),
  budgetMax: num("Max budget", { min: 0 }),
};

const withBudget = (shape) =>
  z
    .object({ ...shape, ...budgetShape, notes: optText(1000) })
    .superRefine((d, ctx) => {
      if (d.budgetMax < d.budgetMin) {
        ctx.addIssue({ code: "custom", path: ["budgetMax"], message: "Max budget must be at least min budget" });
      }
    });

const budgetFields = (suffix = "") => [
  { name: "budgetMin", label: `Min budget (₹)${suffix}`, type: "number", min: 0, placeholder: "50000" },
  { name: "budgetMax", label: `Max budget (₹)${suffix}`, type: "number", min: 0, placeholder: "100000" },
];
const notesField = {
  name: "notes", label: "Additional notes", type: "textarea", optional: true, full: true,
  placeholder: "Anything else the responders should know",
};

export const CATEGORY_STEPS = {
  planner: [
    {
      schema: z.object({
        servicesNeeded: z.array(z.enum(vals(PLANNER_SERVICES))).min(1, "Select at least one service"),
        planningScope: z.enum(vals(PLANNING_SCOPES), { error: "Select a planning scope" }),
        guestCount: num("Guest count", { min: 1 }),
      }),
      fields: [
        { name: "servicesNeeded", label: "Services needed", type: "checkboxes", options: PLANNER_SERVICES, full: true },
        { name: "planningScope", label: "Planning scope", type: "radio", options: PLANNING_SCOPES, full: true },
        { name: "guestCount", label: "Expected guests", type: "number", min: 1, placeholder: "300" },
      ],
    },
    {
      schema: withBudget({}),
      fields: [...budgetFields(), notesField],
    },
  ],

  performer: [
    {
      schema: z.object({
        performerType: z.enum(vals(PERFORMER_TYPES), { error: "Select a performer type" }),
        genre: optText(60),
        durationMinutes: num("Duration", { min: 5, max: 600 }),
      }),
      fields: [
        { name: "performerType", label: "Performer type", type: "select", options: PERFORMER_TYPES, full: true },
        { name: "genre", label: "Genre / style", type: "text", optional: true, placeholder: "e.g. Bollywood" },
        { name: "durationMinutes", label: "Duration (minutes)", type: "number", min: 5, max: 600, placeholder: "90" },
      ],
    },
    {
      schema: withBudget({
        audienceSize: num("Audience size", { min: 1 }),
        equipmentProvided: z.boolean(),
      }),
      fields: [
        { name: "audienceSize", label: "Audience size", type: "number", min: 1, placeholder: "400" },
        { name: "equipmentProvided", label: "We provide sound equipment", type: "toggle", full: true },
        ...budgetFields(),
        notesField,
      ],
    },
  ],

  crew: [
    {
      schema: z.object({
        rolesNeeded: z.array(z.enum(vals(CREW_ROLES))).min(1, "Select at least one role"),
        crewSize: num("Crew size", { min: 1, max: 500 }),
      }),
      fields: [
        { name: "rolesNeeded", label: "Roles needed", type: "checkboxes", options: CREW_ROLES, full: true },
        { name: "crewSize", label: "Total crew size", type: "number", min: 1, max: 500, placeholder: "25" },
      ],
    },
    {
      schema: withBudget({
        shiftHours: num("Shift hours", { min: 1, max: 24, int: false }),
        experienceLevel: z.enum(vals(EXPERIENCE_LEVELS), { error: "Select experience level" }),
        accommodationProvided: z.boolean(),
      }),
      fields: [
        { name: "shiftHours", label: "Shift length (hours)", type: "number", min: 1, max: 24, placeholder: "10" },
        { name: "experienceLevel", label: "Experience level", type: "select", options: EXPERIENCE_LEVELS },
        { name: "accommodationProvided", label: "We provide accommodation", type: "toggle", full: true },
        ...budgetFields(" per day"),
        notesField,
      ],
    },
  ],
};

export const buildDefaults = (fields, saved = {}) =>
  Object.fromEntries(
    fields.map((f) => [
      f.name,
      saved[f.name] ?? (f.type === "checkboxes" ? [] : f.type === "toggle" ? false : ""),
    ])
  );