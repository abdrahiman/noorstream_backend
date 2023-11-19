import Blkom from "./blkom";
import Fushaar from "./fushaar";
import MyCima from "./mycima";
import axios from "axios";

export let providers = [
    { name: "mycima", class: MyCima },
    { name: "blkom", class: Blkom },
    { name: "fushaar", class: Fushaar },
];

export interface ICard {
    title: string;
    url: string;
    type: string;
    posterUrl: string;
    year: string;
}
export interface IEpisode {
    name: string;
    url: string;
}
export interface ISeason {
    name: string;
    url: string;
}
export interface IDownLoad {
    resolution: string;
    url: string;
}

export const getHtml = async (url: string): Promise<string | Error> => {
    let response = null;
    try {
        response = await axios.get(url);
    } catch (err: any) {
        return new Error(err.message);
    }
    return response.data;
};

export interface ISingle {
    title: string;
    story: string;
    posterUrl: string;
    year: string;
    url: string;
    rating?: string;
    tags?: string[];
    recommendation?: ICard[];
    trailer?: string;
    type: string;
    isMovie: boolean;
    watchServersList?: string[];
    downloadList?: IDownLoad[];
    episodes?: IEpisode[];
    seasons?: ISeason[];
}

/*
Shema{
  getMainPage() =>  list[]
  load(url(exp:https://foo.com/movieName)) => 
  if it is a movie ? {
       isMovie, year, posterUrl, title, story, watchServersList, downloadList
  }
  {
   isMovie, year, posterUrl, title, story, episodes, seasons
  }
  
  loadSeason(url(exp:https://foo.com/boo-season-1))=>{
    episodes, downloadList 
  }
  
  loadEpisode(url(exp: https://foo.com/boo-ep-2))=> { watchServersList, downloadList }
   
}
*/
