const express = require('express')
const expressGraphQL = require('express-graphql')
const {
    GraphQLSchema, 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLList, 
    GraphQLInt,
    GraphQLNonNull
} = require('graphql')
const app = express()






const authors = [
    {id:1, name: 'J. K. Rowling'},
    {id:2, name: 'J.R. R. Tolkein'},
    {id:3, name: 'Brent Weeks'}
]


const books = [
    { id:1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
    { id:2, name: 'Harry Potter and the Prizoner of Azkaban', authorId: 2},
    { id:3, name: 'Harry Potter and the Goblet of Fire', authorId: 3 },
    { id:4, name: 'The Fellowship of the Ring', authorId: 2},
    { id:5, name: 'The Two Towers', authorId: 2},
    { id:6, name: 'The Return of the King', authorId: 2},
    { id:7, name: 'The Way of Shadows', authorId: 3},
    { id:8, name: 'Beyond the Shadows', authorId: 3},
]








const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represents a book written by a author',
    feilds: () => ({
        id: {type: GraphQLNonNull(GraphInt)},
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: {type: GraphQLNonNull(GraphQLInt)},
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
})


const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents the author of a book',
    feilds: () => ({
        id: {type: GraphQLNonNull(GraphInt)},
        name: { type: GraphQLNonNull(GraphQLString) },
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => book.authorId === author.id)
            }
        }
    })
})




const schema = new GraphQLSchema({
    query: RootQueryType
})



//now that you have the RootQueryType which is using the BookType you just need to create a schema and then use that schema. As shown above


const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        book: {
            type: BookType,
            description: 'A Single Book',
            args: {
                id: {type: GraphInt}
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'List Of All Books',
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List Of All Authors',
            resolve: () => authors
        },
        author: {
            type: AuthorType,
            description: 'A Single Author',
            args: {
                id:{type: GraphQLInt}
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
        }
    })
})



app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))

app.listen(5000., () => console.log('Server Is Running'))






















/*const express = require('express')
const expressGraphQL = require('express-graphql')
const { GraphQLSchema, GraphQLObjectType, GraphQLString} = require('graphql')
const app = express()

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'HelloWorld',
        fields: () => ({
            message: {
                type: GraphQLString,
                resolve: () => 'Hello World'
            }
        })
    })
})

app.use('./graphql', expressGraphQL({
    schema: schema,
    graphql: true
}))
app.listen(5000., () => console.log('Server Running'))*/


//To check if the server is listening run this in terminal: npm run devStart