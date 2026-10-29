import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

type Property = "body" | "params" | "query";

export function validate(schema: ZodSchema, property: Property = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten(),
      });
    }

    req[property] = result.data;

    next();
  };
}
