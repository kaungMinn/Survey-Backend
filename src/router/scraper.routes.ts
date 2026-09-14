import express from "express";
import { scraperController } from "../controllers/scraper.controller.js";


const router = express.Router();

router.use((req, res, next) => {
    console.log("Scraper Router Time: ", Date.now());
    next();
});

router.post("/scrape-urls", scraperController.scrapeIds);
router.get("/scrape-messages", scraperController.scrapeMessages);
router.get("/scrape-messages-from-games-myanmar", scraperController.scrapeMessagesFromGamesMyanmar)

export const scraperRouter = router;