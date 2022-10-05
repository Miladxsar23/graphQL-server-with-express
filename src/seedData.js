import * as data from "./data.json";
import * as tables from "./tables.js";
import * as database from "./database.js";
// run promise serialize
const sequencePromises = (promises) => {
  return promises.reduce((promise, promiseFunction) => {
    return promise.then(() => {
      return promiseFunction();
    });
  }, Promise.resolve());
};

// create Database
function createDatabase() {
  let promises = [tables.posts, tables.users, tables.usersFriends].map(
    (table) => {
      return () => database.getSql(table.create().toQuery());
    }
  );
  return sequencePromises(promises);
}

// insert initial data from data.json
const insertData = () => {
  console.log("salam");
  let { users, usersFriends, posts } = data;
  let queries = [
    tables.users.insert(users).toQuery(),
    tables.usersFriends.insert(usersFriends).toQuery(),
    tables.posts.insert(posts).toQuery(),
  ];
  let promises = queries.map((query) => {
    return () => database.getSql(query);
  });
  return sequencePromises(promises);
};

createDatabase()
  .then(() => {
    return insertData();
  })
  .then(() => {
    console.log({ done: true });
  });
