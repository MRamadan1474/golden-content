// Load required packeges
const express = require('express');
const app = express();
const path = require('path');
const dotenv = require(`dotenv`);
const morgan = require(`morgan`);
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// load routes

// Add middleware files
const {errorHandler} = require('./middlewares/errorHandler')

// Add config files
const connectDB = require(`./config/db`);

// Read body of request
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// using dotenv
dotenv.config({path: `./config/config.env`});

// use morgan
if(process.env.NODE_ENV === `development`) {
    app.use(morgan(`dev`));

    // auto reload frontend files -> just for development <-
    const livereload = require("livereload");
    const connectLivereload = require("connect-livereload");
  
    const liveReloadServer = livereload.createServer();
    liveReloadServer.watch(path.join(__dirname, 'public'));
    liveReloadServer.watch(path.join(__dirname, 'views'));
  
    app.use(connectLivereload());
}

// Connect to mongodb
connectDB();

// Save sessions to mongodb
let store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'mySessions'
});

// Connect to session
app.use(require('express-session')({
    secret: process.env.SESSION_SECRET,
    store: store,
    resave: false,
    saveUninitialized: true
}));

// Access to public folder
app.use(express.static(path.join(__dirname, 'public')));

// use routes

// Use error handler
app.use(errorHandler);

// Connect to server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`listening to server in ${process.env.NODE_ENV} mode on port ${port}...`);
});

// handle crash server error
process.on('unhandledRejection', (reason, promise) => {
    console.log(`ERROR: ${reason}`);
    server.close(() => process.exit(1));
});