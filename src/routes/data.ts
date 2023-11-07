import express from "express";
import {
    getEpisode,
    getHomePage,
    getSeason,
    SearchAll,
    getSearch,
} from "../controllers/provider";

let router = express.Router();

router.get("/search", SearchAll);
router.get("/:provider/search", getSearch);
router.get("/:provider/episode", getEpisode);
router.get("/:provider/season", getSeason);
router.get("/:provider", getHomePage);

export default router;
