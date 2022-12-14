// dependencies
import express from "express";
import basicAuth from "basic-auth-connect";
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
      resolve(source, args, context, info) {
        // let includeFriend = false;
        // const selectionFragments = info.fieldNodes[0].selectionSet.selections;
        // const userSelections = selectionFragments.filter((selection) => {
        //   return (
        //     selection.kind === "InlineFragment" &&
        //     selection.typeCondition.name.value === "User"
        //   );
        // });
        // userSelections.forEach((selection) => {
        //   selection.selectionSet.selections.forEach((innerSelection) => {
        //     if (innerSelection.name.value === "friends") {
        //       includeFriend = true;
        //     }
        //   });
        // });
        // if (includeFriend) return loaders.getUserNodeWithFriends(args.id);
        // else return loaders.getNodeById(args.id);
        return loaders.getNodeById(args.id);
      },
    },
    viewer : {
      type : NodeInterface, 
      resolve(obj, args, context) {
        return loaders.getNodeById(context)
      }
    }
  },
});

const Schema = new GraphQLSchema({
  query: RootQuery,
  types: [UserType, PostType],
});

const app = express();
// Set basic authentication method as middleware for api
app.use(
  basicAuth(function (user, pass) {
    return pass === "mypassword1";
  })
);
app.use(
  "/graphql",
  graphqlHTTP((req) => {
    // req.user comes from older middleware that bound with basicAuth to req Object
    const context = "users:" + req.user;
    return { schema: Schema, context, graphiql: true, pretty: true };
  })
);
export default app;
