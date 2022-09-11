// dependencies
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { GraphQLObjectType, GraphQLSchema, GraphQLString } = require("graphql");
// server configurations
const server = express();
const port = 3000;
const RootQuery = new GraphQLObjectType({
    name : "RootQuery", 
    description:"the root query", 
    fields : {
        viewer : {
            type : GraphQLString, 
            resolve() {
                return "viewer!"
            }
        }
    }
})
const Schema = new GraphQLSchema({
    query : RootQuery
})

server.use("/graphql", graphqlHTTP({schema : Schema, graphiql : true}));

server.listen(port, () => {
  console.log("server run in http://localhost:3000");
});
