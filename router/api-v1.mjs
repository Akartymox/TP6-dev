import express from "express";
import createError from "http-errors";
import * as db from "../database/database.mjs";

const router = express.Router();

// GET / : nombre de liens
router.get("/", (_request, response) => {
  return response.json({ count: db.count() });
});

// POST / : créer un lien
router.post("/", (request, response, next) => {
  const url = request.body?.url;
  if (typeof url !== "string" || url.length === 0) {
    return next(createError(400, "Missing 'url'"));
  }
  try {
    new URL(url);
  } catch {
    return next(createError(400, "Invalid URL"));
  }

  const link = db.create(url);
  return response.status(201).json({
    url: link.url,
    short: `${request.protocol}://${request.get("host")}/${link.url}`,
    created: link.created,
  });
});

// GET /error : test 500
router.get("/error", () => {
  throw new Error("Test 500");
});

// GET /status/:url
router.get("/status/:url", (request, response, next) => {
  const link = db.findByUrl(request.params.url);
  if (!link) return next(createError(404));
  return response.json({
    created: link.created,
    origin: link.origin,
    visit: link.visit,
  });
});

// GET /:url : redirection + incrément
router.get("/:url", (request, response, next) => {
  const link = db.findByUrl(request.params.url);
  if (!link) return next(createError(404));
  db.incrementVisit(link.url);
  return response.redirect(301, link.origin);
});

export default router;