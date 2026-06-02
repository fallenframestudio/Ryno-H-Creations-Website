import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import fs from "fs";
import router from "./routes";
import { logger } from "./lib/logger";
import { pool } from "@workspace/db";

const app: Express = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [];

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function runMigrations() {
  try {
    await pool.query(`
      ALTER TABLE paintings ADD COLUMN IF NOT EXISTS sold boolean NOT NULL DEFAULT false;
      ALTER TABLE paintings ADD COLUMN IF NOT EXISTS orientation text NOT NULL DEFAULT 'portrait';
    `);
    logger.info("Migrations applied successfully");
  } catch (err) {
    logger.error({ err }, "Migration failed");
  }
}

runMigrations();

app.use("/api", router);

const staticDir = path.resolve(process.cwd(), "artifacts/ryno-h-creations/dist/public");

if (fs.existsSync(staticDir)) {
  app.use(express.static(staticDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticDir, "index.html"));
  });
  logger.info({ staticDir }, "Serving frontend static files");
}

export default app;
