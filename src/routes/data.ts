import express from "express";
import {
    getEpisode,
    getHomePage,
    getSeason,
    SearchAll,
    getSearch,
} from "../controllers/provider";

let router = express.Router();

router.get("/", getHomePage);
router.get("/search", getSearch);
router.get("/episode", getEpisode);
router.get("/season", getSeason);

export default router;
