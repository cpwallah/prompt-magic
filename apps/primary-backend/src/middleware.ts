import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Unauthorized - Missing token" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized - Invalid token format" });
    return;
  }

  try {
    const publicKey = process.env.JWT_PUBLIC_KEY?.replace(/\\n/g, "\n");

    if (!publicKey) {
      res.status(500).json({ message: "Missing JWT public key" });
      return;
    }

    const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
    const userId = (decoded as any)?.sub || (decoded as any)?.sub;

    if (!userId) {
      res
        .status(401)
        .json({ message: "Unauthorized - Missing userId in token" });
      return;
    }

    req.userId = userId;
    next(); // ✅ Let Express know to continue
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
}
