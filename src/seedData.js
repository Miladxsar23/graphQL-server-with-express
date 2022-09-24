const data = require("./data.json");
const tables = require("./tables");
const database = require("./database");

const createDatabase = () => {
  let promises = [tables.users, tables.usersFriends, tables.posts].map(
    (table) => {
      return database.getSql(table.create().toQuery());
    }
  );
  return Promise.all(promises);
};
