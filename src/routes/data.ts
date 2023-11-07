import express from "express";
import {
    getEpisode,
    getHomePage,
    getSeason,
    SearchAll,
    getSearch,
} from "../controllers/provider";
import { providers } from "../../utils/providers/list";

let router = express.Router();
router.get("/", (req, res) => {
    return res
        .status(200)
        .send({
            providers: providers.map((el) => ({
                name: el.name,
                url: new el.class().mainUrl,
            })),
        });
});
router.get("/search", SearchAll);
router.get("/:provider/search", getSearch);
router.get("/:provider/episode", getEpisode);
router.get("/:provider/season", getSeason);
router.get("/:provider", getHomePage);

export default router;
