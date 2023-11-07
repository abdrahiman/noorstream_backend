import axios from "axios";
import { load } from "cheerio";

interface IAnime {
    title: string;
}

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
    async getSearch(query: string) {
        const q = query.replace(/ /g, "%20");
        let res = await axios.get(this.mainUrl + "?search_param=animes&s=" + q);
        const result: IAnime[] = [];
    }
}
