import express from "express";
import createError from "http-errors";
import * as db from "../database/database.mjs";

const router = express.Router();

// GET / : JSON ou HTML
router.get("/", (_request, response) => {
  response.format({
    json: () => response.json({ count: db.count() }),
    html: () => response.render("root", { count: db.count(), link: null }),
    default: () => response.status(406).send("Not Acceptable"),
  });
});

// POST / : créer
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
  const shortUrl = `${request.protocol}://${request.get("host")}/${link.url}`;

  response.format({
    json: () =>
      response.status(201).json({
        url: link.url,
        short: shortUrl,
        created: link.created,
      }),
    html: () =>
      response
        .status(201)
        .render("root", { count: db.count(), link: { ...link, shortUrl } }),
    default: () => response.status(406).send("Not Acceptable"),
  });
});

// DELETE /:url : suppression avec auth
router.delete("/:url", (request, response, next) => {
  const link = db.findByUrl(request.params.url);
  if (!link) return next(createError(404));

  const apiKey = request.get("X-API-KEY");
  if (!apiKey) return next(createError(401));
  if (apiKey !== link.secret) return next(createError(403));

  db.remove(link.url);
  return response.status(200).json({ message: "Deleted", url: link.url });
});

// GET /:url : JSON status ou HTML redirect
router.get("/:url", (request, response, next) => {
  const link = db.findByUrl(request.params.url);
  if (!link) return next(createError(404));

  response.format({
    json: () =>
      response.json({
        created: link.created,
        origin: link.origin,
        visit: link.visit,
      }),
    html: () => {
      db.incrementVisit(link.url);
      return response.redirect(301, link.origin);
    },
    default: () => response.status(406).send("Not Acceptable"),
  });
});

export default router;