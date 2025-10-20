require('lightrun').start({
      lightrunSecret: '47b41d7b-c8d7-4ffd-93e5-c944fc2c2daf',
      apiEndpoint: 'app.lightrun.com',
      extraPaths: ['node_modules', 'node_modules/mysql', 'node_modules/express-myconnection'],
      metadata: {
        registration: {
            displayName: "Main App",
            tags: ['Local']
        }
    }
  });
console.log('[lightrun] init called'); // quick console sanity check
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
//app.get('/__probe__', (req, res) => {
  //const probeMarker = Date.now();  // ← put a Snapshot here (no condition)
  //return res.json({ ok: true, probeMarker });
//});
// (Optional) tiny health route to verify what PASS is at runtime
//app.get('/__env_check__', (req, res) => {
  //res.json({
    //passLen: PASS ? PASS.length : 0,
    //demoStartupCrash: process.env.DEMO_STARTUP_CRASH || '0'
  //});
//});
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
//app.use(express.urlencoded({extended: false}));
// Parse JSON bodies (needed for your VB scenario posting application/json)
app.use(express.json());

// Parse HTML form posts (x-www-form-urlencoded). Using extended:true is safer for nested fields.
app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/', customerRoutes);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port 3000');  
})