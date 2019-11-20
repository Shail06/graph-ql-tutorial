const graphql = require('graphql');
const _=require('lodash');

// Different Types imported fom the graphql package
const {GraphQLObjectType, 
        GraphQLString,
        GraphQLSchema} = graphql;

// Array Containing the dummy data 
var books = [
    {name: 'Book1', id: '1', genre: 'G1'},
    {name: 'Book2', id: '2', genre: 'G2'},
    {name: 'Book3', id: '3', genre: 'G3'}
];

// Defined a new type which is part of Problem i.e. A book
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type:GraphQLString},
        name: {type:GraphQLString},
        genre: {type:GraphQLString},
    })
});

/* Root Query is the starting point of a request to GraphQL server. 
It matches the syntax of input query with that of fields declared here in schema and fetches the information.
*/
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType, 
            args:{id:{type: GraphQLString}},
            resolve(parent, args){
                return _.find(books, {id:args.id});
            }
        },
    }
});

// The query exported from here is imported in app.js. This contains the whole schema object
module.exports = new GraphQLSchema({
    query: RootQuery
});