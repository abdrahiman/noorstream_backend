

import puppeteerExtra from 'puppeteer-extra';
import Stealth from 'puppeteer-extra-plugin-stealth';
// npm i puppeteer-extra puppeteer-extra-plugin-stealth
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
            puppeteerExtra.use(Stealth());
  const browser = await puppeteerExtra.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ignoreHTTPSErrors: true,
    
  });

  const page = await browser.newPage();

    await page.goto('https://witanime.pics/');
    await page.waitForSelector(".ep-card-anime-title h3 a");
    const data = await page.evaluate(() => {
        let title = document.querySelectorAll(".ep-card-anime-title h3 a");
        let episode = document.querySelectorAll(".episodes-card-title h3 a");
        let image = document.querySelectorAll(".ehover6 img.img-responsive");
        let link = document.querySelectorAll(".ehover6 a");
        let arr: any = [];
        for (let i = 0; i < title.length; i++) {
            arr.push({
                title: title[i].textContent,
                episode: episode[i].textContent,
                image: image[i].getAttribute("src"),
                link: link[i].getAttribute("href"),
            });
        }
        return arr;
    }
    );
    await browser.close();
    return data;
        } catch (err) {
            console.error("Error fetching data:", err);
            return null;
        }
    }

    async getSearch(query: any): Promise<IEpisode[] | null> {
        try {
            puppeteerExtra.use(Stealth());
    const browser = await puppeteerExtra.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true,
        
        });

    
    const page = await browser.newPage();
    await page.goto(`https://witanime.pics/?search_param=animes&s=${query}`);
    await page.waitForSelector(".ep-card-anime-title h3 a");
    const data = await page.evaluate(() => {
        let title = document.querySelectorAll(".ep-card-anime-title h3 a");
        let episode = document.querySelectorAll(".episodes-card-title h3 a");
        let image = document.querySelectorAll(".ehover6 img.img-responsive");
        let link = document.querySelectorAll(".ehover6 a");
        let statu= document.querySelectorAll(".anime-card-poster .anime-card-status a");
        let type= document.querySelectorAll(".anime-card-details anime-card-type a");
        let arr: any = [];
        for (let i = 0; i < title.length; i++) {
            arr.push({
                title: title[i].textContent,
                episode: episode[i].textContent,
                image: image[i].getAttribute("src"),
                link: link[i].getAttribute("href"),
                type: type[i].textContent,
                statu: statu[i].textContent,
            });
        }
        return arr;
    }
    );
    await browser.close();
    return data;
    }
    catch (err) {
            console.error("Error fetching data:", err);
            return null;
    }
    }
}
