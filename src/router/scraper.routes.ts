import express from "express";
import { scraperController } from "../controllers/scraper.controller.js";


const router = express.Router();

router.use((req, res, next) => {
    console.log("Scraper Router Time: ", Date.now() );
    next();
});

router.post("/scrape-urls", scraperController.scrapeIds );



export const scraperRouter =  router;