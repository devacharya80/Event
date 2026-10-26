import { Router } from "express";
import {
  createRequirement, listRequirements, getRequirement,
} from "../controllers/requirement.controller.js";

const router = Router();

router.route("/").post(createRequirement).get(listRequirements);
router.get("/:id", getRequirement);

export default router;