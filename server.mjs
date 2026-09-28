import express from "express";
import morgan from "morgan";
import logger from "loglevel";
import favicon from "serve-favicon";
import createError from "http-errors";
import fs from "node:fs";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import { PORT, IS_DEV, APP_VERSION } from "./config.mjs";
import apiV1 from "./router/api-v1.mjs";
import apiV2 from "./router/api-v2.mjs";

logger.setLevel(IS_DEV ? logger.levels.DEBUG : logger.levels.WARN);

const app = express();

app.disable("x-powered-by");
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon("static/logo_univ_16.png"));
if (IS_DEV) app.use(morgan("dev"));

// Middleware version
app.use((_request, response, next) => {
  response.setHeader("X-API-version", APP_VERSION);
  next();
});

// Statique
app.use(express.static("static"));

// Swagger
const spec = YAML.parse(fs.readFileSync("static/open-api.yaml", "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

// API
app.use("/api-v1", apiV1);
app.use("/api-v2", apiV2);

// 404
app.use((request, _response, next) => {
  logger.debug(`default route handler : ${request.url}`);
  return next(createError(404));
});

// Handler d'erreur
app.use((error, _request, response, _next) => {
  logger.error(`default error handler: ${error}`);
  const status = error.status ?? 500;
  const stack = IS_DEV ? error.stack : "";
  return response
    .status(status)
    .json({ code: status, message: error.message, stack });
});

app.listen(PORT, "0.0.0.0", () => {
  logger.info(`Server listening on http://localhost:${PORT}`);
});