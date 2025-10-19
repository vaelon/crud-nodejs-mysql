require('lightrun').start({
      lightrunSecret: '47b41d7b-c8d7-4ffd-93e5-c944fc2c2daf',
      apiEndpoint: 'app.lightrun.com',
      extraPaths: ['node_modules\mysql', 'node_modules\express-myconnection'],
      metadata: {
        registration: {
            displayName: "Main App",
            tags: ['Local']
        }
    }
  });
const express = require("express");
const morgan = require("morgan");
const mysql = require("mysql");
const myConnection = require("express-myconnection");
const path = require('path');
const app = express();
require('dotenv').config();
// learning pull request
// To get the database password from the .env file
const PASS = process.env.DATABASE_PASSWORD;

// Importing routes
const customerRoutes = require('./routes/customer');

// settings
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middlewares
app.use(morgan('dev'));
app.use(myConnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: PASS,
    port: '3306',
    database: 'crudnodejsmysql'
}, 'single'));
app.use(express.urlencoded({extended: false}));

// Routes
app.use('/', customerRoutes);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port 3000');
})