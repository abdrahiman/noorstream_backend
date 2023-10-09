import express from "express";

let router = express.Router();
router.get("/", () => {});
router.get("/:provider/url", () => {});
router.get("/:provider/episide/:url", () => {});

export default router;
