import axios from "axios";
import { load } from "cheerio";
import { ICard, ISingle, getHtml } from "./list";

export default class Fushaar {
    mainUrl: string;
    name: string;
    constructor() {
        this.mainUrl = "https://www.fushaar.com";
        this.name = "Fushaar";
    }
    //utils
    toSearchResponse(element: any): ICard {
        const url = element.find("article.poster a").attr("href");
        const posterUrl = element.find("img").attr("data-lazy-src");
        const year = element.find("ul.labels li.year").text();
        const titleOne = element.find("div.info h3").text();
        const titleTwo = element.find("div.info h4").text();
        // const title =
        //     titleOne === titleTwo && titleOne
        //         ? titleOne
        //         : `${titleOne}\n${titleTwo}`;

        return {
            title: titleOne,
            url,
            type: "movie",
            year,
            posterUrl,
        };
    }
    async getMainPage(
        page?: string,
        limit = 24
    ): Promise<ICard[] | null | Error> {
        let list: ICard[] = [];
        let html = await getHtml(`${this.mainUrl}/${page}`);
        if (html instanceof Error) {
            return html;
        }
        let $ = load(html);
        $("article.poster").each((index: number, element) => {
            if (index == limit) return;
            list.push(this.toSearchResponse($(element)));
        });
        return list;
    }
    async search(
        query: string,
        page?: string,
        limit = 24
    ): Promise<ICard[] | null | Error> {
        const q = query.replace(/ /g, "%20").replace(" ", "+");
        const html = await getHtml(
            `${this.mainUrl}/?s=${q}${page ? "&page=" + page : ""}`
        );
        if (html instanceof Error) {
            return new Error(
                "Failed to process the request. An internal server error occurred while handling your request."
            );
        }
        const $ = load(html);
        let searchResults: ICard[] = [];
        $("article.poster").each((index, element) => {
            if (index == limit) return;
            searchResults.push(this.toSearchResponse($(element)));
        });
        return searchResults;
    }
    async loadPage(url: string): Promise<ISingle | Error | null> {
        let html = await getHtml(url);
        if (html instanceof Error) {
            return new Error(
                "Failed to process the request. An internal server error occurred while handling your request."
            );
        }
        const $ = load(html);
        // const bigPoster = $('meta[property="og:image"]').attr("content");
        const posterUrl = $("figure.poster img").attr("data-lazy-src") || "";
        const year = $("header span.yearz").text().replace("(", "");
        const ARtitle = $("header h1").text();
        const ENtitle = $("header h2").text();
        // const title = ARtitle !== ENtitle ? `${ARtitle} | ${ENtitle}` : ARtitle;
        const title = ENtitle;
        const synopsis = $("div.postz").text();
        const trailer = $("#new-stream > div > div.ytb > a").attr("href");
        const tags = $("div.zoomInUp a")
            .map((index, element) => $(element).text())
            .get();
        const rating = $(
            "body > div.new-info.hide-mobile > div > div.z-imdb > div"
        ).text();
        const recommendation = $("article.poster")
            .map((index, element) => {
                return this.toSearchResponse($(element));
            })
            .get();
        return {
            posterUrl,
            year,
            url,
            type: "movie",
            isMovie: true,
            tags,
            title,
            story: synopsis,
            rating,
            recommendation,
            trailer,
        };
    }
    async loadSeason(url: string) {
        return null;
    }
    async loadEpisode(url: string) {
        return null;
    }
}
