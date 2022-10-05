import sqlite3 from "sqlite3";
import * as tables from "./tables";
export const db = new sqlite3.Database("./db.sqlite");
// Change logic from callvack base to Promise base
// because the GraphQL library uses promises to resolve fields in resolve function
export const getSql = (query) => {
  return new Promise((resolve, reject) => {
    console.log(query.text);
    console.log(query.values);
    db.all(query.text, query.values, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};
