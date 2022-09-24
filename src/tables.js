const sql = require("sql");
// set the SQL dialect
sql.setDialect("sqlite");

// TABLES:

//// -- Users
const users = sql.define({
  name: "users",
  columns: [
    {
      name: "id",
      dataType: "INTEGER",
      primaryKey: true,
    },
    {
      name: "name",
      dataType: "text",
    },
    {
      name: "about",
      dataType: "text",
    },
  ],
});
//// --- usersFriends
const usersFriends = sql.define({
  name: "users_friends",
  columns: [
    {
      name: "user_id_a",
      dataType: "int",
    },
    {
      name: "user_id_b",
      dataType: "int",
    },
    {
      name: "level",
      dataType: "text",
    },
  ],
});

//// --- posts
const posts = sql.define({
  name: "posts",
  columns: [
    {
      name: "id",
      dataType: "INTEGER",
      primaryKey: true,
    },
    {
      name: "user_id",
      dataType: "int",
    },
    {
      name: "body",
      dataType: "text",
    },
    {
      name: "level",
      dataType: "text",
    },
    {
      name: "create_at",
      dataType: "dateTime",
    },
  ],
});

module.exports = { posts, users, usersFriends };
