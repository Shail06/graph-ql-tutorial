const graphql = require('graphql');
const _=require('lodash');

// Different Types imported fom the graphql package
const {GraphQLObjectType, 
        GraphQLString,
        GraphQLSchema,
        GraphQLID,
        GraphQLInt,
    GraphQLList} = graphql;

// Array Containing the dummy data 
var books = [
    {name: 'Book1', id: '1', genre: 'G1', authorId: '1'},
    {name: 'Book2', id: '2', genre: 'G2', authorId: '2'},
    {name: 'Book3', id: '3', genre: 'G3', authorId: '1'},
    {name: 'Book4', id: '4', genre: 'G3', authorId: '1'},
    {name: 'Book4', id: '5', genre: 'G3', authorId: '3'},
];

var authors = [
    {name: 'Author1', id: '1', age: 22},
    {name: 'Author2', id: '2', age: 25},
    {name: 'Author3', id: '3', age: 12}
]

// Defined a new type which is part of Problem i.e. A book
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type:GraphQLID},
        name: {type:GraphQLString},
        genre: {type:GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args){
                return _.find(authors, {id: parent.authorId});
            }
        }
    })
});

const AuthorType = new GraphQLObjectType(
    {
        name: 'Author',
        fields: () =>(
            {
                name:{type:GraphQLString},
                id: {type: GraphQLID},
                age: {type: GraphQLInt},
                books: {
                    type: new GraphQLList(BookType),
                    resolve(parent, args){
                        return _.filter(books, {authorId: parent.id});
                    }
                }
            }
        )
    }
);

/* Root Query is the starting point of a request to GraphQL server. 
It matches the syntax of input query with that of fields declared here in schema and fetches the information.
*/
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType, 
            args:{id:{type: GraphQLID}},
            resolve(parent, args){
                return _.find(books, {id:args.id});
            }
        },
        author:{
            type: AuthorType,
            args:{id:{type: GraphQLID}},
            resolve(parent, args){
                return _.find(authors, {id: args.id});
            }
        }
    }
});

// The query exported from here is imported in app.js. This contains the whole schema object
module.exports = new GraphQLSchema({
    query: RootQuery
});