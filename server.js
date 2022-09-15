// dependencies
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
} = require("graphql");
// server configurations
const server = express();
const port = 3000;
// ----- Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  description: "the root Query",
  fields: {
    viewer: {
      type: GraphQLString,
      resolve() {
        return "viewer";
      },
    },
    node: {
      type : GraphQLString, 
      args : {
        id : {
          type : new GraphQLNonNull(GraphQLID)
        }
      }, 
      resolve(source, args) {
        return inMemoryStore[args.id]
      }
    }
  },
});
// ------- Mutations
let inMemoryStore = Object.create(null)
const RoouMutation = new GraphQLObjectType({
  name : "RootMutation", 
  description : "the root mutation", 
  fields : {
    setNode : {
      type : GraphQLString, 
      args : {
        id : {
          type : new GraphQLNonNull(GraphQLID)
        }, 
        value : {
          type : new GraphQLNonNull(GraphQLString)
        }
      }, 
      resolve(source, args) {
        inMemoryStore[args.id] = args.value
        console.log(inMemoryStore)
        return inMemoryStore[args.id]
      }
    }
  }
})

//  ------- Schema
const Schema = new GraphQLSchema({
  query: RootQuery,
  mutation : RoouMutation
});

server.use("/graphql", graphqlHTTP({ schema: Schema, graphiql: true }));

server.listen(port, () => {
  console.log("server run in http://localhost:3000");
});
