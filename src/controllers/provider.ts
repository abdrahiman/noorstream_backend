import { Request, Response } from "express";
import { WitAnime } from "../../utils/providers/witanime";

let getHomePage = async (req: Request, res: Response) => {
    try {
        // get all the latest anime episodes from the website then return it to the user
        let data = await WitAnime.prototype.getHomePage();
        // send the data to the user
        res.status(200).json(data);
    } 
    catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};

let getEpisode = async (req: Request, res: Response) => {
    try {
    }
    catch (err: any) {
        return null;
    }
};
let getSeason = async (req: Request, res: Response) => {
    try {
    }
    catch (err: any) {
        return null;
    }
};
let getSearch = async (req: Request, res: Response) => {
    try {
        // get the search query from the user then search for it in the website then return the results to the user
        let query = req.query.q;
        let data = await WitAnime.prototype.getSearch(query);
        // send the data to the user
        res.status(200).json(data);

    }
    catch (err: any) {
        return res.status(403).json({ error: err.message });
    }
};
let SearchAll = async (req: Request, res: Response) => {
    try {
    } catch (err: any) {
        return null;
    }
};
export { getHomePage, getEpisode, getSearch, getSeason, SearchAll };
