import { Context, Next } from "hono";


import { BadRequestError } from "../utils/errors";

export const validateObjectId = (paramName: string) => {
    return async (c: Context, next: Next) => {
        const id = c.req.param(paramName);

        // Check if id is a 24-character hex string (valid MongoDB ObjectId format)
        if (!/^[a-fA-F0-9]{24}$/.test(id)) {
            throw new BadRequestError(`Invalid ${paramName} ID format`);
        }

        await next();
    };
};

export default validateObjectId;
