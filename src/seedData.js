import * as data from "./data";
import * as tables from "./tables";
import * as database from "./database";

// run promise serialize
const sequencePromises = (promises) => {
  return promises.reduce((promise, promiseFunction) => {
    return promise.then(() => {
      promiseFunction();
    });
  }, Promise.resolve());
};

// create Database
function createDatabase() {
  let promises = [tables.posts, tables.users, tables.usersFriends].map(
    (table) => {
      return database.getSql(table.create().toQuery());
    }
  );
  return sequencePromises(promises);
}
