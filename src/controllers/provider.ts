import { Request, Response } from "express";
import { providers } from "../../utils/providers/list";

let handleError = (res: Response, status: number, message: string) => {
    return res.status(status).send({ error: message });
};

const validateProvider = (res: Response, providerName: string) => {
    if (!providerName) {
        return new Error("This provider name is not valid");
    }
    if (!providers.some((e) => e.name === providerName)) {
        return new Error("This provider does not exist yet");
    }
};
const validateUrl = (res: Response, url: string | undefined) => {
    try {
        url = new URL(url || "").toString();
    } catch (err) {
        return new Error("This URL is not valid");
    }
};

let getHomePage = async (req: Request, res: Response) => {
    try {
        let { provider }: { provider?: string } = req.params;
        let {
            page,
            limit,
            Url,
        }: { page?: string; limit?: string; Url?: string } = req.query;
        if (validateProvider(res, provider) instanceof Error) {
            return res
                .status(401)
                .send({ error: validateProvider(res, provider)?.message });
        }
        //get the class from the providers list
        let ProviderClass = providers.find((p) => p.name == provider)?.class;
        if (!ProviderClass) return res.status(400).send("this class not found");

        let obj = new ProviderClass();

        if (Url) {
            if (validateUrl(res, Url) instanceof Error) {
                return res
                    .status(401)
                    .send({ error: validateUrl(res, Url)?.message });
            }
            let result = await obj.loadPage(Url || "");
            if (result instanceof Error) {
                return handleError(res, 500, result.message);
            }

            return res.status(200).send(result);
        }
        let result = await obj.getMainPage(
            page,
            limit ? Number(limit) : undefined
        );
        if (result instanceof Error) {
            return handleError(res, 500, result.message);
        }
        return res.status(200).send(result);
    } catch (err: any) {
        return handleError(res, 500, err.message);
    }
};

let getEpisode = async (req: Request, res: Response) => {
    try {
        let { provider }: { provider?: string } = req.params;
        let { Url }: { page?: string; limit?: string; Url?: string } =
            req.query;
        if (validateProvider(res, provider) instanceof Error) {
            return res
                .status(401)
                .send({ error: validateProvider(res, provider)?.message });
        }
        if (validateUrl(res, Url) instanceof Error) {
            return res
                .status(401)
                .send({ error: validateUrl(res, Url)?.message });
        }
        if (!providers.some((e) => e.name == provider)) {
            return res.status(401).send("this provider does not exist yet !");
        }
        //get the class from the providers list
        let ProviderClass = providers.find((p) => p.name == provider)?.class;
        if (!ProviderClass) return res.status(400).send("this class not found");
        let obj = new ProviderClass();
        let result = await obj.loadEpisode(Url || "");
        if (result instanceof Error) {
            return handleError(res, 500, result.message);
        }
        return res.status(200).send(result);
    } catch (err: any) {
        return handleError(res, 500, err.message);
    }
};
let getSeason = async (req: Request, res: Response) => {
    try {
        let { provider }: { provider?: string } = req.params;
        let { Url }: { page?: string; limit?: string; Url?: string } =
            req.query;
        if (validateProvider(res, provider) instanceof Error) {
            return res
                .status(401)
                .send({ error: validateProvider(res, provider)?.message });
        }
        if (validateUrl(res, Url) instanceof Error) {
            return res
                .status(401)
                .send({ error: validateUrl(res, Url)?.message });
        }
        //get the class from the providers list
        let ProviderClass = providers.find((p) => p.name == provider)?.class;
        if (!ProviderClass) return res.status(400).send("this class not found");
        let obj = new ProviderClass();

        let result = await obj.loadSeason(Url || "");
        if (result instanceof Error) {
            return handleError(res, 500, result.message);
        }
        return res.status(200).send(result);
    } catch (err: any) {
        return handleError(res, 500, err.message);
    }
};
let getSearch = async (req: Request, res: Response) => {
    try {
        let { provider }: { provider?: string } = req.params;
        let { page, limit, q }: { page?: string; limit?: string; q?: string } =
            req.query;
        if (validateProvider(res, provider) instanceof Error) {
            return handleError(
                res,
                401,
                validateProvider(res, provider)?.message || ""
            );
        }
        if (!q) {
            return res.status(401).send("this query is not valid");
        }
        if (!providers.some((e) => e.name == provider)) {
            return res.status(401).send("this provider does not exist yet !");
        }
        //get the class from the providers list
        let ProviderClass = providers.find((p) => p.name == provider)?.class;
        if (!ProviderClass) return res.status(400).send("this class not found");
        let obj = new ProviderClass();

        let result = await obj.search(
            q,
            page,
            limit ? Number(limit) : undefined
        );
        if (result instanceof Error) {
            return handleError(res, 500, result.message);
        }
        return res.status(200).send(result);
    } catch (err: any) {
        return handleError(res, 500, err.message);
    }
};
let SearchAll = async (req: Request, res: Response) => {
    try {
        let result = [];
        let { q }: { q?: string } = req.query;
        for (let pro of providers) {
            let Class = new pro.class();
            let res = await Class.search(q || "");
            if (res instanceof Error) {
                result.push({ provider: pro.name, data: [] });
            }
            result.push({ provider: pro.name, data: res });
        }
        return res.status(200).send(result);
    } catch (err: any) {
        return handleError(res, 500, err.message);
    }
};
export { getHomePage, getEpisode, getSearch, getSeason, SearchAll };
