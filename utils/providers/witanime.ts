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
        const latestEpisodes: any[] = [];
        $(".episodes-card-container .episodes-card").each((index, element) => {
            const title = $(element).find(".ep-card-anime-title h3 a").text();
            const episode = $(element).find(".episodes-card-title h3 a").text();
            const image = $(element)
                .find(".ehover6 img.img-responsive")
                .attr("src");
            const link = $(element).find(".ehover6 a").attr("href");
            const data = {
                title,
                episode,
                image,
                link,
            };
            latestEpisodes.push(data);
        });
        return latestEpisodes;
    }
    async getSearch(query: string) {
        const q = query.replace(/ /g, "%20");
        let res = await axios.get(this.mainUrl + "?search_param=animes&s=" + q);
        const result: IAnime[] = [];
    }
}
