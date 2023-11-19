import { load, Element } from "cheerio";
import { ICard, IDownLoad, IEpisode, ISingle, getHtml } from "./list";

export default class Blkom {
    mainUrl: string;
    name: string;
    constructor() {
        this.mainUrl = "https://animeblkom.net";
        this.name = "balcom";
    }
    //utils {
    toSearchResponse(element: any) {
        const url: string = element.find("div.poster a").attr("href");
        const name: string = element.find("div.name a").text();
        const poster: string =
            this.mainUrl + element.find("div.poster img").attr("data-original");
        const year: string = element
            .find('div[title="سنة الانتاج"]')
            .text()
            .trim();

        const tvTypeText = element.find(".relation").text();
        const tvType: string = tvTypeText.includes("فيلم|خاصة")
            ? "Movie"
            : tvTypeText.includes("أوفا|أونا")
            ? "OVA"
            : "Anime";

        return {
            title: name,
            url,
            type: tvType,
            year,
            posterUrl: poster,
        };
    }
    //}

    //components
    async getMainPage(
        page?: string,
        limit = 24
    ): Promise<ICard[] | null | Error> {
        let list: {
            title: string;
            url: string;
            type: string;
            posterUrl: string;
            year: string;
        }[] = [];
        let html = await getHtml(
            `${this.mainUrl}/animes-list${page ? "?page=" + page : ""}`
        );
        if (html instanceof Error) {
            return html;
        }

        const $ = load(html);
        $("section.list-section div.content").map((i: number, element) => {
            if (i == limit) return;
            list.push(this.toSearchResponse($(element)));
        });

        return list;
    }
    async loadSeason(url: string) {
        return null;
    }
    async loadEpisode(url: string) {
        let html = await getHtml(url);
        if (html instanceof Error) {
            return html;
        }
        let $ = load(html);
        const watchServersList: string[] = [];
        $(".servers-container span.server > a").each(
            (i: number, el: Element) => {
                watchServersList.push(`${$(el).attr("data-src")}`);
            }
        );
        let downloadList: { resolution: string; url: string }[] = [];

        $("#download div.panel-body > a").each((i: number, el: Element) => {
            downloadList.push({
                resolution: $(el).text().trim().replace("\n", " "),
                url: $(el).attr("href") || "",
            });
        });
        return { watchServersList, downloadList };
    }
    async search(
        query: string,
        page?: string,
        limit = 24
    ): Promise<ICard[] | null | Error> {
        const q = query.replace(/ /g, "%20").replace(" ", "+");
        const html = await getHtml(
            `${this.mainUrl}/search?query=${q}${page ? "&page=" + page : ""}`
        );
        if (html instanceof Error) {
            return html;
        }
        const $ = load(html);
        let searchResults: ICard[] = [];
        $("section.search-page-results div.content")
            .map((i: number, element) => {
                if (i == limit) return;
                searchResults.push(this.toSearchResponse($(element)));
            })
            .get();

        return searchResults.sort((a, b) => a.title.localeCompare(b.title));
    }
    async loadPage(url: string): Promise<ISingle | Error | null> {
        let html = await getHtml(url);
        if (html instanceof Error) {
            return html;
        }
        const $ = load(html);

        const title = $("span h1").text().replace(/\(.*$/, "");
        const poster = this.mainUrl + $("div.poster img").attr("data-original");
        const story = $(".story p").text();
        const trailer = $("#promo > div iframe").attr("data-src");
        const genre = $("p.genres a")
            .map((_, element) => $(element).text())
            .get();
        const year = $(".info-table div:contains(تاريخ الانتاج) span.info")
            .text()
            .split("-")[0];
        const typeText = $("h1 small").text().toLowerCase();
        const type = typeText.includes("movie")
            ? "AnimeMovie"
            : typeText.includes("ova|ona")
            ? "OVA"
            : "Anime";

        const rating = $(".rating-box span").text();
        const episodes = [];
        const episodeElements = $(".episode-link");
        if (episodeElements.length === 0) {
            episodes.push({ url, name: "Watch" });
        } else {
            episodeElements.each((_, element) => {
                const a = $(element).find("a");
                episodes.push({
                    url: a.attr("href"),
                    name: a.text().replace(/\n/g, "").replace(":", " "),
                });
            });
        }
        let reco: ICard[] = [];
        console.log(
            $("div.content-wrapper .container.eps-slider .item").text()
        );
        $("div.content-wrapper .container.eps-slider .item").each((_, el) => {
            let type = $(el).find(".relation").text();
            let data = {
                title: $(el).find("div.name").text(),
                url: $(el).find("a").attr("href") || "",
                type: type.includes("فيلم|خاصة")
                    ? "Movie"
                    : type.includes("أوفا|أونا")
                    ? "OVA"
                    : "Anime",
                year: type,
                posterUrl:
                    this.mainUrl +
                    $("el").find("div.image img").attr("data-src"),
            };
            reco.push(data);
        });

        return {
            title,
            url,
            recommendation: reco,
            trailer,
            isMovie: type == "AnimeMovie",
            type,
            rating,
            posterUrl: poster,
            year,
            episodes: episodes,
            story,
            tags: genre,
        };
    }
}
