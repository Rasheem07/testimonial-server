// /middlewares/validate.ts
import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

export const validateRequest = (body: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = body.validate(req.body, {abortEarly: false});
    if (error) {
      return res
        .status(400)
        .json({
          type: error.details[0].context?.key || "",
          error: error.details[0].message,
        });
    }
    next();
  };
};
