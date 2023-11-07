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
    try {
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
        if (!title || !episode || !image || !link) return;
        const data = {
          title,
          episode,
          image,
          link,
        };
        latestEpisodes.push(data);
      });
      return latestEpisodes;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
