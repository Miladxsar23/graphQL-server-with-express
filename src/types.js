import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
} from "graphql";

import * as tables from "./tables.js";
import * as loaders from "./loaders.js";

////////////////////////////////////////////////// Node Interface
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

////////////////////////////////////////////////// PageInfo
const PageInfoType = new GraphQLObjectType({
  name: "PageInfo",
  fields: {
    hasNextPage: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    hasPreviousPage: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    startCursor: {
      type: GraphQLString,
    },
    endCursor: {
      type: GraphQLString,
    },
  },
});
////////////////////////////////////////////////// User Type
const resolveId = (source) => {
  return tables.dbIdToNodeId(source.id, source.__tableName);
};
export const UserType = new GraphQLObjectType({
  name: "User",
  interfaces: [NodeInterface],
  fields: () => {
    return {
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
        type: new GraphQLList(UserType),
        resolve(source) {
          // if (source.__friends) {
          //   return source.__friends.map((friend) => {
          //     return tables.dbIdToNodeId(friend.user_id_b, friend.__tableName);
          //   });
          // }
          return loaders.getFriendIdsFromUser(source).then((rows) => {
            const promises = rows.map((row) => {
              const friendIdNode = tables.dbIdToNodeId(
                row.user_id_b,
                row.__tableName
              );
              return loaders.getNodeById(friendIdNode);
            });
            return Promise.all(promises);
          });
        },
      },
      posts: {
        type: PostsConnectionType,
        args: {
          after: {
            type: GraphQLString,
          },
          first: {
            type: GraphQLInt,
          },
        },
        resolve: (source, args, context, info) => {
          return loaders
            .getPostIdsForUser(source, args, context)
            .then(({ rows, pageInfo }) => {
              const promises = rows.map((row) => {
                const postNodeId = tables.dbIdToNodeId(row.id, row.__tableName);
                return loaders.getNodeById(postNodeId).then((node) => {
                  return { node, cursor: row.__cursor };
                });
              });
              return Promise.all(promises).then((edges) => {
                return {
                  edges,
                  pageInfo,
                };
              });
            });
        },
      },
    };
  },
});

////////////////////////////////////////////////// Post Type
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
// ---------------------- PostTypeEdge
const PostEdgeType = new GraphQLObjectType({
  name: "PageEdge",
  fields: {
    cursor: {
      type: new GraphQLNonNull(GraphQLString),
    },
    node: {
      type: new GraphQLNonNull(PostType),
    },
  },
});
// ----------------------- PostsConnectionType
export const PostsConnectionType = new GraphQLObjectType({
  name: "PostsConnection",
  fields: {
    pageInfo: {
      type: new GraphQLNonNull(PageInfoType),
    },
    edges: {
      type: new GraphQLList(PostEdgeType),
    },
  },
});
