import {Response} from "express";

export const throwInternalError = (res: Response, msg: string, error: unknown) => {
    console.error(`${msg}: `, error);
    res.status(500).json({error: "Internal server error"})
}