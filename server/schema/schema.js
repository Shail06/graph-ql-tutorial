const graphql = require('graphql');
const _=require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

// Different Types imported fom the graphql package
const {GraphQLObjectType, 
        GraphQLString,
        GraphQLSchema,
        GraphQLID,
        GraphQLInt,
    GraphQLList} = graphql;

/*
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
*/
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
                // return _.find(authors, {id: parent.authorId}); // To fetch data from array
                return Author.findById(parent.authorId);
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
                        // return _.filter(books, {authorId: parent.id});
                        return Book.find({authorId: parent.id});
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
                // return _.find(books, {id:args.id});
                return Book.findById(args.id);
            }
        },
        author:{
            type: AuthorType,
            args:{id:{type: GraphQLID}},
            resolve(parent, args){
                //return _.find(authors, {id: args.id});
                return Author.findById(args.id);
            }
        },
        books:{
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return Book.find({});
            }
        },
        authors:{
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                return Author.find({}); // Finds all the collections in MongoDb
            }
        }
    }
});
/*
Creating a Mutation. A mutation takes in the given data and stores it into the database
as compared to a given graph query which just fetches the data.
*/
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        addAuthor:{
            type: AuthorType,
            args:{
                name: {type: GraphQLString},
                age: {type: GraphQLInt}
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook:{
            type: BookType,
            args:{
                name: {type: GraphQLString},
                genre: {type: GraphQLString},
                authorId: {type: GraphQLID}
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        }
    }
});


// The query exported from here is imported in app.js. This contains the whole schema object
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});