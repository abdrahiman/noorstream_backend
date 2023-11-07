import { Request, Response } from "express";
import { WitAnime } from "../../utils/providers/witanime";

let getHomePage = async (req: Request, res: Response) => {
    try {
        // get all the latest anime episodes from the website then return it to the user
        let data = await WitAnime.prototype.getHomePage();
        // send the data to the user
        console.log(data);
        res.status(200).json(data);
    } 
    catch (err: any) {
        return null;
    }
};

let getEpisode = async (req: Request, res: Response) => {
    try {
    } catch (err: any) {
        return null;
    }
};
let getSeason = async (req: Request, res: Response) => {
    try {
    } catch (err: any) {
        return null;
    }
};
let getSearch = async (req: Request, res: Response) => {
    try {
    } catch (err: any) {
        return null;
    }
};
let SearchAll = async (req: Request, res: Response) => {
    try {
    } catch (err: any) {
        return null;
    }
};
export { getHomePage, getEpisode, getSearch, getSeason, SearchAll };
