import {
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} from "graphql";
import * as tables from "./tables";
export const NodeInterface = new GraphQLInterfaceType({
  name: "Node",
  fields: {
    id: new GraphQLNonNull(GraphQLID),
  },
  resolveType : (source) => {
    if(source.__tablename === tables.users.getName()) {
        return UserType
    }
    return PostType
  }
});
