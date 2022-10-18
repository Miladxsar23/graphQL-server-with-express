import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInterfaceType,
  GraphQLList,
} from "graphql";

import * as tables from "./tables.js";
import * as loaders from "./loaders.js";

// Node Interface
export const NodeInterface = new GraphQLInterfaceType({
  name: "Node",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolveType: (source) => {
    if (source.__tableName === tables.users.getName()) return UserType;
    else return PostType;
  },
});
// User Type
const resolveId = (source) => {
  return tables.dbIdToNodeId(source.id, source.__tableName);
};
export const UserType = new GraphQLObjectType({
  name: "User",
  interfaces: [NodeInterface],
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: resolveId,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    about: {
      type: new GraphQLNonNull(GraphQLString),
    },
    friends: {
      type: new GraphQLList(GraphQLID),
      resolve(source) {
        if (source.__friends) {
          return source.__friends.map((friend) => {
            return tables.dbIdToNodeId(friend.user_id_b, friend.__tableName);
          });
        }
        return loaders.getFriendIdsFromUser(source).then((rows) => {
          return rows.map((row) => {
            return tables.dbIdToNodeId(row.user_id_b, row.__tableName);
          });
        });
      },
    },
  },
});

// Post Type
export const PostType = new GraphQLObjectType({
  name: "Post",
  interfaces: [NodeInterface],
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: resolveId,
    },
    createAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(obj) {
        return obj["created_at"];
      },
    },
    body: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});
