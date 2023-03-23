const {ApolloServer,gql} = require("apollo-server");
const mongoose = require("mongoose");

const {MONGODB} = require("./config.js");
const {typeDefs} = require("./graphql/schema.js");
const resolvers = require("./graphql/resolvers/index.js");


const server = new ApolloServer({
    typeDefs,
    resolvers
});

mongoose.connect(MONGODB,{useNewUrlParser : true})
.then(()=>{
    console.log("Mongodb connected.");
    return server.listen({port:3000});
})
.then(({url})=>{
    console.log("Visit "+url);
});