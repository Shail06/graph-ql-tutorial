const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongo = require('mongoose');
const app = express();

mongo.connect('mongodb+srv://admin:admin@cluster0-xdtfh.azure.mongodb.net/test?retryWrites=true&w=majority')

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