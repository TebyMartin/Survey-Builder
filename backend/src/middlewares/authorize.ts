import { Request, Response, NextFunction } from "express";

type Role = "ADMIN" | "EDITOR" | "INTERVIEWER" | "VIEWER";

export function authorize(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "No autenticado",
      });
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      return res.status(403).json({
        message: "No tenés permisos para realizar esta acción",
      });
    }

    next();
  };
}
