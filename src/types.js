import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInterfaceType,
  GraphQLList,
} from "graphql";

import * as tables from "./tables.js";

// Node Interface
export const NodeInterface = new GraphQLInterfaceType({
  name: "Node",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolveType : (source) => {
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
    },
    body: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});
