import { NextFunction, Request, RequestHandler, Response } from "express";
import { PostgresClient } from "../lib/db";

export const doesSpaceExists: RequestHandler = async (
    req: Request, // Use AuthenticatedRequest here
    res: Response,
    next: NextFunction 
) => {

    const { spaces } = req.body;

    const space = await PostgresClient.query('SELECT * FROM spaces where space_name=$1 LIMIT 1', [spaces.space_name]);

    if(space.rows[0]){
        return res.json({error: "Space with this name already exists"});
    }
     
    next();
}