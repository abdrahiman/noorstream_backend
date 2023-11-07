import axios from "axios";
import { load } from "cheerio";

export class WitAnime {
    mainUrl: string;
    name: string;
    constructor() {
        this.mainUrl = "https://witanime.pics/";
        this.name = "witanime";
    }
    async getHomePage() {
        let res = await axios.get(this.mainUrl);
        let $ = load(res.data);
        //start scraping
    }
}
