const express = require('express'); // Gives the server
const graphqlHTTP = require('express-graphql'); // gives the graphql query processing engine from server
const schema = require('./schema/schema'); // Query provided is matched against schema defined in schema.js
const mongo = require('mongoose'); // Connectivity to MongoDB as database

const app = express();

mongo.connect('mongodb+srv://admin:admin@cluster0-ipkhx.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

mongo.connection.once('open', ()=> {
    console.log('Connected to Mongo DB!');
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql:true
}));
app.listen(4000, () => {
    console.log('Listening to 4000');
});