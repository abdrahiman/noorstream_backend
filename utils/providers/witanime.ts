import axios from "axios";
import { load } from "cheerio";

interface IEpisode {
    title: string;
    episode: string;
    image: string;
    link: string;
}

export class WitAnime {
    mainUrl: string;
    name: string;

    constructor() {
        this.mainUrl = "https://witanime.pics/";
        this.name = "witanime";
    }

    async getHomePage(): Promise<IEpisode[] | null> {
        try {
            const res = await axios.get("https://witanime.pics/");
            const $ = load(res.data);
            const latestEpisodes: IEpisode[] = [];

            $(".episodes-card-container .episodes-card").each((index, element) => {
                const title = $(element).find(".ep-card-anime-title h3 a").text();
                const episode = $(element).find(".episodes-card-title h3 a").text();
                const image = $(element).find(".ehover6 img.img-responsive").attr("src");
                const link = $(element).find(".ehover6 a").attr("href");

                if (title && episode && image && link) {
                    const data: IEpisode = {
                        title,
                        episode,
                        image,
                        link,
                    };
                    latestEpisodes.push(data);
                }
            });

            return latestEpisodes;
        } catch (err) {
            console.error("Error fetching data:", err);
            return null;
        }
    }
}
