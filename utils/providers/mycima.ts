import { load, Element, CheerioAPI, Cheerio } from "cheerio";
import axios from "axios";
import { ICard, getHtml, IDownLoad, IEpisode, ISingle } from "./list";

export default class MyCima {
    mainUrl: string;
    name: string;
    constructor() {
        this.mainUrl = "https://weciimaa.online";
        this.name = "mycima";
    }
    //utils {

    getImageURL(input: string | undefined) {
        if (!input) return "";
        return input.replace(/--im(age|g):url\(|\);/g, "");
    }
    toSearchResponse(element: Cheerio<Element>) {
        const url = element.find("div.Thumb--GridItem a").attr("href") || "";
        const posterUrl = this.getImageURL(
            element.find("span.BG--GridItem").attr("data-lazy-style")
        );
        const year = element.find("div.GridItem span.year").text();
        let title = element
            .find("div.Thumb--GridItem strong")
            .text()
            .replace(year, "")
            .replace(/مشاهدة|فيلم|مسلسل|مترجم/g, "")
            .replace("( نسخة مدبلجة )", " ( نسخة مدبلجة ) ")
            .trim();

        const type = element
            .find("div.Thumb--GridItem a")
            .attr("title")
            ?.includes("فيلم")
            ? "Movie"
            : "TvSeries";

        return {
            title,
            url,
            provider: this.name,
            type,
            posterUrl,
            year: this.getIntFromText(year)?.toString() || "",
        };
    }
    getIntFromText(input: string | undefined) {
        if (!input) return null;
        const match = input.match(/\d+/);
        return match ? parseInt(match[0]) : null;
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
            provider: string;
            type: string;
            posterUrl: string;
            year: string;
        }[] = [];
        const urls = [
            `${this.mainUrl}/seriestv/new${page ? "?page_number=" + page : ""}`,
            `${this.mainUrl}/movies/${page ? page : ""}`,
        ];
        let res = axios.get(urls[0]);
        let res1 = axios.get(urls[1]);
        let promise;
        try {
            promise = await Promise.all([res, res1]);
        } catch (err: any) {
            return new Error(err.message);
        }
        for (let response of promise) {
            const $ = load(response.data);
            $("div.Grid--WecimaPosts div.GridItem").each(
                (i: number, el: Element) => {
                    if (i == Math.round(limit / 2)) return;
                    const searchResponse = this.toSearchResponse($(el));
                    if (searchResponse) {
                        list.push(searchResponse as any);
                    }
                }
            );
        }

        return list;
    }
    async loadSeason(url: string) {
        let html = await getHtml(url);
        if (html instanceof Error) {
            return html;
        }
        let $ = load(html);
        let episodes: { name: string; url: string }[] = [];
        $("div.Episodes--Seasons--Episodes a").each(
            (i: number, el: Element) => {
                episodes.push({
                    url: $(el).attr("href") || "",
                    name: $(el).find("episodetitle").text(),
                });
            }
        );

        let downloadList: { resolution: string; url: string }[] = [];
        $("ul.Season--Download--Wecima--Single a").each(
            (i: number, el: Element) => {
                downloadList.push({
                    resolution: $(el).find("resolution").text().trim(),
                    url: $(el).attr("href") || "",
                });
            }
        );

        return { episodes, downloadList };
    }
    async loadEpisode(url: string) {
        let html = await getHtml(url);
        if (html instanceof Error) {
            return html;
        }
        let $ = load(html);
        const watchServersList: string[] = [];
        $("ul.WatchServersList li btn").each((i: number, el: Element) => {
            watchServersList.push(`${$(el).attr("data-url")}`);
        });
        let downloadList: { resolution: string; url: string }[] = [];

        $("ul.List--Download--Wecima--Single li").each(
            (i: number, el: Element) => {
                downloadList.push({
                    resolution: $(el).find("resolution").text().trim(),
                    url: $(el).find("a").attr("href") || "",
                });
            }
        );
        return { watchServersList, downloadList };
    }
    async search(
        query: string,
        page?: string,
        limit = 24
    ): Promise<ICard[] | null | Error> {
        const q = query.replace(/ /g, "%20");
        const result: ICard[] = [];
        const searchUrls = [
            `${this.mainUrl}/search/${q}${page ? "/page/" + page : ""}`,
            `${this.mainUrl}/search/${q}/list/series${
                page ? "?page_number=" + page : ""
            }`,
            `${this.mainUrl}/search/${q}/list/anime${
                page ? "?page_number=" + page : ""
            }`,
        ];
        let res = axios.get(searchUrls[0]);
        let res1 = axios.get(searchUrls[1]);
        let res2 = axios.get(searchUrls[2]);
        let promise;
        try {
            promise = await Promise.all([res, res1, res2]);
        } catch (err: any) {
            return new Error(
                "Failed to process the request. An internal server error occurred while handling your request."
            );
        }

        for (const response of promise) {
            if (!response) continue;
            const $ = load(response.data);

            $("divdiv").each((i: number, el: Element) => {
                if (!$(el).text().includes("اعلان")) {
                    if (i == limit) return;
                    const searchResponse = this.toSearchResponse($(el));
                    if (searchResponse) {
                        result.push(searchResponse as any);
                    }
                }
            });
        }

        return (
            result
                // .filter(
                //   (value, index, self) =>
                //     self.findIndex((item) => item.title === value.title) === index
                // )
                .sort((a, b) => a.title.localeCompare(b.title))
        );
    }
    async loadPage(url: string): Promise<ISingle | null | Error> {
        let html = await getHtml(url);
        if (html instanceof Error) {
            return html;
        }
        let doc = load(html);

        const isMovie = doc("ol li:nth-child(3)").text().includes("افلام");
        const trailer = doc(".TrailerCode iframe").attr("data-ifr") || "";
        let posterUrl =
            this.getImageURL(
                doc("wecima.separated--top").attr("data-lazy-style")
            ) || "";

        const year = doc("div.Title--Content--Single-begin h1 a.unline").text();
        let story = doc("div.StoryMovieContent").text();
        const title = doc("div.Title--Content--Single-begin h1")
            .text()
            .replace(`(${year})`, "")
            .replace(/مشاهدة|فيلم|مسلسل|مترجم|انمي/g, "");
        const watchServersList: string[] = [];
        doc("ul.WatchServersList li btn").each((i: number, el: Element) => {
            watchServersList.push(`${doc(el).attr("data-url")}`);
        });

        let downloadList: IDownLoad[] = [];
        doc("ul.List--Download--Wecima--Single li").each(
            (i: number, el: Element) => {
                downloadList.push({
                    resolution: doc(el).find("resolution").text().trim(),
                    url: doc(el).find("a").attr("href") || "",
                });
            }
        );
        let reco: ICard[] = [];
        doc("div.Grid--WecimaPosts div.GridItem").each(
            (i: number, el: Element) => {
                reco.push(this.toSearchResponse(doc(el)));
            }
        );
        //if it is a movie
        if (!isMovie) {
            posterUrl =
                this.getImageURL(doc("wecima.separated--top").attr("style")) ||
                "";

            story = doc("singlecontainerleft .PostItemContent").text();
            let episodes: { name: string; url: string }[] = [];
            doc("div.Episodes--Seasons--Episodes a").each(
                (i: number, el: Element) => {
                    episodes.push({
                        url: doc(el).attr("href") || "",
                        name: doc(el).find("episodetitle").text(),
                    });
                }
            );
            let seasons: IEpisode[] = [];
            doc("div.List--Seasons--Episodes a").each(
                (i: number, el: Element) => {
                    seasons.push({
                        url: doc(el).attr("href") || "",
                        name: doc(el).text(),
                    });
                }
            );

            return {
                type: "serie",
                isMovie,
                trailer,
                recommendation: reco,
                year,
                posterUrl,
                title,
                story,
                url,
                episodes,
                seasons,
            };
        }

        return {
            type: "movie",
            isMovie,
            recommendation: reco,
            year,
            posterUrl,
            trailer,
            title,
            url,
            story,
            watchServersList,
            downloadList,
        };
    }
}
