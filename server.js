// dependencies
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { NodeInterface, UserType, PostType } from "./src/types.js";
import * as loaders from "./src/loaders.js";
import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
} from "graphql";

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  description: "the root query",
  fields: {
    node: {
      type: NodeInterface,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(source, args) {
        return loaders.getNodeById(args.id)
      },
    },
  },
});

const Schema = new GraphQLSchema({
  query: RootQuery,
  types: [UserType, PostType],
});

const app = express();
app.use("/graphql", graphqlHTTP({ schema: Schema, graphiql: true }));
export default app;
