import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { DB_FILE, LINK_LEN } from "../config.mjs";

// Schéma inline — plus besoin du fichier database.sql
const SCHEMA = `
CREATE TABLE IF NOT EXISTS links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT UNIQUE NOT NULL,
  origin TEXT NOT NULL,
  visit INTEGER NOT NULL DEFAULT 0,
  created INTEGER NOT NULL,
  secret TEXT NOT NULL
);
`;

const dir = path.dirname(DB_FILE);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const db = new Database(DB_FILE);
db.exec(SCHEMA);

const countStmt = db.prepare("SELECT COUNT(*) AS count FROM links");
const insertStmt = db.prepare(
  "INSERT INTO links (url, origin, visit, created, secret) VALUES (?, ?, 0, ?, ?)"
);
const findByUrlStmt = db.prepare("SELECT * FROM links WHERE url = ?");
const incrementStmt = db.prepare(
  "UPDATE links SET visit = visit + 1 WHERE url = ?"
);
const deleteStmt = db.prepare("DELETE FROM links WHERE url = ?");

const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function randomCode(length) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return result;
}

export function generateUrl() {
  return randomCode(LINK_LEN);
}

export function generateSecret() {
  return randomCode(LINK_LEN);
}

export function count() {
  return countStmt.get().count;
}

export function create(origin) {
  let url;
  do {
    url = generateUrl();
  } while (findByUrlStmt.get(url));

  const secret = generateSecret();
  insertStmt.run(url, origin, Date.now(), secret);
  return findByUrlStmt.get(url);
}

export function findByUrl(url) {
  return findByUrlStmt.get(url);
}

export function incrementVisit(url) {
  return incrementStmt.run(url);
}

export function remove(url) {
  return deleteStmt.run(url);
}