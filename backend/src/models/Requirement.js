import mongoose from "mongoose";
import {
  EVENT_TYPES, PLANNER_SERVICES, PLANNING_SCOPES,
  PERFORMER_TYPES, CREW_ROLES, EXPERIENCE_LEVELS,
} from "../config/constants.js";

const options = { discriminatorKey: "category", timestamps: true, versionKey: false };

const requirementSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
    eventType: { type: String, required: true, enum: EVENT_TYPES },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    venue: { type: String, trim: true, maxlength: 120 },
  },
  options
);

// Listing by category, newest first, is the main query
requirementSchema.index({ category: 1, createdAt: -1 });

const budget = {
  budgetMin: { type: Number, required: true, min: 0 },
  budgetMax: { type: Number, required: true, min: 0 },
};

const Requirement = mongoose.model("Requirement", requirementSchema);

export const Planner = Requirement.discriminator(
  "planner",
  new mongoose.Schema({
    servicesNeeded: { type: [{ type: String, enum: PLANNER_SERVICES }], validate: (v) => v.length > 0 },
    planningScope: { type: String, enum: PLANNING_SCOPES, required: true },
    guestCount: { type: Number, required: true, min: 1 },
    ...budget,
    notes: { type: String, trim: true, maxlength: 1000 },
  })
);

export const Performer = Requirement.discriminator(
  "performer",
  new mongoose.Schema({
    performerType: { type: String, enum: PERFORMER_TYPES, required: true },
    genre: { type: String, trim: true, maxlength: 60 },
    durationMinutes: { type: Number, required: true, min: 5, max: 600 },
    audienceSize: { type: Number, required: true, min: 1 },
    equipmentProvided: { type: Boolean, default: false },
    ...budget,
    notes: { type: String, trim: true, maxlength: 1000 },
  })
);

export const Crew = Requirement.discriminator(
  "crew",
  new mongoose.Schema({
    rolesNeeded: { type: [{ type: String, enum: CREW_ROLES }], validate: (v) => v.length > 0 },
    crewSize: { type: Number, required: true, min: 1, max: 500 },
    shiftHours: { type: Number, required: true, min: 1, max: 24 },
    experienceLevel: { type: String, enum: EXPERIENCE_LEVELS, required: true },
    accommodationProvided: { type: Boolean, default: false },
    ...budget, // per day for crew
    notes: { type: String, trim: true, maxlength: 1000 },
  })
);

export default Requirement;